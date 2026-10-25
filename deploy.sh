#!/usr/bin/env bash
# ==============================================================================
# Portfolio Retro OS - Script de Autodespliegue en Podman
# ==============================================================================
# Autor: Martín Alejandro Garbiso
# Descripción: Despliegue automatizado en producción con detección inteligente
#              de puertos libres para evitar colisiones con otros servicios.
# ==============================================================================

set -eo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Configuración por defecto
CONTAINER_NAME="portfolio-retro-os"
IMAGE_NAME="localhost/portfolio-retro-os:latest"
START_PORT=8080
END_PORT=9000
BIND_IP="0.0.0.0"
CUSTOM_PORT=""
NO_CACHE=false
BUILD_ONLY=false

# Paleta de colores para terminal retro / moderna
BOLD='\033[1m'
RESET='\033[0m'
CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
GRAY='\033[0;90m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'

print_banner() {
    echo -e "${CYAN}${BOLD}"
    echo "  ╔═══════════════════════════════════════════════════════════════╗"
    echo "  ║        MARTÍN OS - SISTEMA DE AUTODESPLIEGUE PODMAN         ║"
    echo "  ║       Producción Containerizada & Detección de Puertos        ║"
    echo "  ╚═══════════════════════════════════════════════════════════════╝"
    echo -e "${RESET}"
}

print_help() {
    print_banner
    echo -e "${BOLD}USO:${RESET}"
    echo -e "  ./deploy.sh [OPCIONES]"
    echo ""
    echo -e "${BOLD}OPCIONES:${RESET}"
    echo -e "  ${GREEN}-p, --port <puerto>${RESET}       Forzar un puerto específico en vez de autodetectar"
    echo -e "  ${GREEN}-s, --start-port <p>${RESET}      Puerto inicial para el escaneo de puertos (por defecto: 8080)"
    echo -e "  ${GREEN}-e, --end-port <p>${RESET}        Puerto límite para el escaneo (por defecto: 9000)"
    echo -e "  ${GREEN}-b, --bind <ip>${RESET}           IP de escucha del host (por defecto: 0.0.0.0)"
    echo -e "  ${GREEN}-n, --name <nombre>${RESET}       Nombre del contenedor (por defecto: portfolio-retro-os)"
    echo -e "  ${GREEN}--no-cache${RESET}                Reconstruir la imagen sin usar caché"
    echo -e "  ${GREEN}--build-only${RESET}              Solo compilar la imagen sin lanzar el contenedor"
    echo -e "  ${YELLOW}--status${RESET}                  Mostrar estado, puerto y salud del contenedor desplegado"
    echo -e "  ${YELLOW}--duckdns${RESET}                 Comprobar y sincronizar IP en DuckDNS (garbisoft.duckdns.org)"
    echo -e "  ${YELLOW}--duckdns-status${RESET}          Mostrar estado detallado de IP y sincronización DuckDNS"
    echo -e "  ${YELLOW}--logs${RESET}                    Seguir en vivo los logs del contenedor (stdout/stderr)"
    echo -e "  ${YELLOW}--restart${RESET}                 Reiniciar el contenedor preservando su puerto"
    echo -e "  ${RED}--stop${RESET}                    Detener y eliminar el contenedor en ejecución"
    echo -e "  ${CYAN}-h, --help${RESET}                Mostrar esta ayuda"
    echo ""
    echo -e "${BOLD}EJEMPLOS:${RESET}"
    echo -e "  ./deploy.sh                     # Despliegue automático con detección inteligente"
    echo -e "  ./deploy.sh -p 8085             # Desplegar en el puerto 8085 específico"
    echo -e "  ./deploy.sh -s 3000             # Comenzar búsqueda de puertos libres desde el 3000"
    echo -e "  ./deploy.sh --status            # Consultar estado de la aplicación"
    echo ""
}

# Obtiene la IP local / LAN del host
get_host_ip() {
    local ip
    ip=$(hostname -I 2>/dev/null | awk '{print $1}')
    if [ -z "$ip" ]; then
        ip=$(ip route get 1.1.1.1 2>/dev/null | grep -oP 'src \K\S+')
    fi
    echo "${ip:-127.0.0.1}"
}

# Obtiene detalles del proceso o servicio que ocupa un puerto
get_port_process() {
    local port="$1"
    local proc=""
    if command -v ss >/dev/null 2>&1; then
        proc=$(ss -tulpn 2>/dev/null | grep -E "(^|:)${port}\s" | head -n1 | grep -oP 'users:\(\(\K[^\)]+' | sed 's/\"//g')
    fi
    if [ -z "$proc" ] && command -v lsof >/dev/null 2>&1; then
        proc=$(lsof -ti ":$port" 2>/dev/null | head -n1)
    fi
    echo "$proc"
}

# Comprueba si un puerto está en uso mediante múltiples métodos
is_port_in_use() {
    local port="$1"

    # 1. Inspeccionar sockets en escucha mediante ss
    if command -v ss >/dev/null 2>&1; then
        if ss -tuln 2>/dev/null | awk '{print $5}' | grep -E "(^|:)${port}$" >/dev/null 2>&1; then
            return 0
        fi
    fi

    # 2. Comprobación directa mediante socket TCP del kernel/bash
    if (timeout 1 bash -c "</dev/tcp/127.0.0.1/$port") 2>/dev/null; then
        return 0
    fi

    # 3. Comprobar si Podman tiene mapeado el puerto en algún contenedor activo
    if command -v podman >/dev/null 2>&1; then
        if podman ps --format "{{.Ports}}" 2>/dev/null | grep -E "(^|:|->)${port}(/|->|$)" >/dev/null 2>&1; then
            return 0
        fi
    fi

    # 4. Fallback con lsof si existe
    if command -v lsof >/dev/null 2>&1; then
        if lsof -iTCP:"$port" -sTCP:LISTEN >/dev/null 2>&1; then
            return 0
        fi
    fi

    return 1 # Puerto LIBRE
}

# Encuentra el primer puerto libre disponible en el rango
find_available_port() {
    local current_port="$1"
    local max_port="$2"

    echo -e "${GRAY}→ Escaneando sockets del sistema desde el puerto ${current_port}...${RESET}" >&2

    while [ "$current_port" -le "$max_port" ]; do
        if is_port_in_use "$current_port"; then
            local proc_info
            proc_info=$(get_port_process "$current_port")
            if [ -n "$proc_info" ]; then
                echo -e "  ${YELLOW}⚠ [OCUPADO]${RESET} Puerto ${BOLD}$current_port${RESET} en uso por: ${GRAY}$proc_info${RESET}" >&2
            else
                echo -e "  ${YELLOW}⚠ [OCUPADO]${RESET} Puerto ${BOLD}$current_port${RESET} en uso por otro servicio del servidor." >&2
            fi
            current_port=$((current_port + 1))
        else
            echo -e "  ${GREEN}✓ [LIBRE]${RESET} Puerto ${BOLD}${GREEN}$current_port${RESET} disponible para despliegue." >&2
            echo "$current_port"
            return 0
        fi
    done

    echo -e "${RED}✗ Error: No se encontró ningún puerto libre en el rango $1 - $2.${RESET}" >&2
    return 1
}

# Construye la imagen del contenedor con alta resiliencia
build_image() {
    local no_cache_arg=""
    if [ "$NO_CACHE" = true ]; then
        no_cache_arg="--no-cache"
    fi

    echo -e "${BLUE}:: [1/4] Preparando e iniciando construcción de imagen (${IMAGE_NAME})...${RESET}"

    # Intentamos primero la construcción nativa con Podman/Buildah
    local build_success=false
    if podman build $no_cache_arg -t "$IMAGE_NAME" -f Containerfile . 2>&1; then
        build_success=true
        echo -e "${GREEN}✓ Imagen construida exitosamente con Podman multi-stage build.${RESET}"
    else
        echo -e "${YELLOW}ℹ Podman build no pudo usar overlayfs del kernel (posible reinicio de kernel pendiente en Arch).${RESET}"
        echo -e "${CYAN}→ Activando pipeline de empaquetado OCI de alta resiliencia...${RESET}"

        # Compilar los ficheros estáticos en el host con npm
        if [ ! -d "dist" ] || [ "$NO_CACHE" = true ]; then
            echo -e "${GRAY}→ Compilando assets estáticos con Astro...${RESET}"
            npm run build
        else
            echo -e "${GRAY}→ Recompilando assets estáticos para garantizar frescura...${RESET}"
            npm run build
        fi

        # Crear contenedor temporal base Nginx y montar assets
        echo -e "${GRAY}→ Empaquetando capa de servidor web Nginx Alpine...${RESET}"
        local tmp_cid
        tmp_cid=$(podman create --name "tmp-builder-$$" docker.io/library/nginx:alpine)

        podman cp nginx.conf "${tmp_cid}:/etc/nginx/conf.d/default.conf"
        podman cp dist/. "${tmp_cid}:/usr/share/nginx/html/"

        # Guardar como imagen definitiva con metadatos y healthcheck
        echo -e "${GRAY}→ Generando manifest OCI y etiquetas de producción...${RESET}"
        podman commit \
            --change "EXPOSE 80" \
            --change "HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 CMD wget -q -O /dev/null http://127.0.0.1:80/health || exit 1" \
            --change 'CMD ["nginx", "-g", "daemon off;"]' \
            "$tmp_cid" "$IMAGE_NAME" >/dev/null

        podman rm -f "$tmp_cid" >/dev/null
        build_success=true
        echo -e "${GREEN}✓ Imagen OCI generada con éxito (${IMAGE_NAME}).${RESET}"
    fi

    if [ "$build_success" != true ]; then
        echo -e "${RED}✗ Falló la creación de la imagen del contenedor.${RESET}" >&2
        exit 1
    fi
}

# Verificación de salud HTTP
verify_health() {
    local port="$1"
    echo -e "${BLUE}:: [4/4] Verificando estado de salud de la aplicación...${RESET}"

    local max_retries=15
    local count=0
    local healthy=false

    while [ "$count" -lt "$max_retries" ]; do
        sleep 1
        local code
        code=$(curl -s -o /dev/null -w "%{http_code}" "http://127.0.0.1:${port}/health" 2>/dev/null || echo "000")
        if [ "$code" = "200" ]; then
            healthy=true
            break
        fi
        # Fallback a raíz
        code=$(curl -s -o /dev/null -w "%{http_code}" "http://127.0.0.1:${port}/" 2>/dev/null || echo "000")
        if [ "$code" = "200" ]; then
            healthy=true
            break
        fi
        count=$((count + 1))
        echo -n "."
    done
    echo ""

    if [ "$healthy" = true ]; then
        echo -e "${GREEN}${BOLD}✓ ¡Servicio activo y respondiendo correctamente (HTTP 200 OK)!${RESET}"
    else
        echo -e "${YELLOW}⚠ El contenedor inició pero la comprobación HTTP no devolvió 200 tras 15 segundos.${RESET}"
        echo -e "${GRAY}Consulta los logs con: ./deploy.sh --logs${RESET}"
    fi
}

# Acción: Mostrar estado
cmd_status() {
    print_banner
    echo -e "${BOLD}ESTADO DEL CONTENEDOR '${CONTAINER_NAME}':${RESET}"
    if ! podman container exists "$CONTAINER_NAME" 2>/dev/null; then
        echo -e "  ${YELLOW}● El contenedor '${CONTAINER_NAME}' no está creado ni en ejecución.${RESET}"
        exit 0
    fi

    local status
    status=$(podman inspect "$CONTAINER_NAME" --format '{{.State.Status}}' 2>/dev/null || echo "desconocido")
    local ports
    ports=$(podman inspect "$CONTAINER_NAME" --format '{{range $p, $conf := .NetworkSettings.Ports}}{{range $conf}}{{.HostPort}}->{{$p}} {{end}}{{end}}' 2>/dev/null || echo "N/A")
    local started
    started=$(podman inspect "$CONTAINER_NAME" --format '{{.State.StartedAt}}' 2>/dev/null || echo "N/A")

    if [ "$status" = "running" ]; then
        echo -e "  Estado:         ${GREEN}${BOLD}● ACTIVO (Running)${RESET}"
    else
        echo -e "  Estado:         ${RED}● DETENIDO (${status})${RESET}"
    fi
    echo -e "  Puertos:        ${CYAN}${ports}${RESET}"
    echo -e "  Iniciado:       ${GRAY}${started}${RESET}"
    echo ""

    if [ -x "${SCRIPT_DIR}/scripts/duckdns-sync.sh" ]; then
        echo -e "${BOLD}ESTADO DE DOMINIO Y DUCKDNS:${RESET}"
        "${SCRIPT_DIR}/scripts/duckdns-sync.sh" --check
        echo ""
    fi

    echo -e "${BOLD}ÚLTIMAS LÍNEAS DE LOG:${RESET}"
    podman logs --tail 10 "$CONTAINER_NAME" 2>&1 | sed 's/^/  │ /'
    echo ""
}

# Acción: Parar contenedor
cmd_stop() {
    print_banner
    echo -e "${YELLOW}:: Deteniendo contenedor '${CONTAINER_NAME}'...${RESET}"
    if podman container exists "$CONTAINER_NAME" 2>/dev/null; then
        podman stop -t 5 "$CONTAINER_NAME" 2>/dev/null || true
        podman rm -f "$CONTAINER_NAME" 2>/dev/null || true
        echo -e "${GREEN}✓ Contenedor detenido y eliminado con éxito.${RESET}"
    else
        echo -e "${GRAY}No existe ningún contenedor con el nombre '${CONTAINER_NAME}'.${RESET}"
    fi
}

# Acción: Ver logs
cmd_logs() {
    if ! podman container exists "$CONTAINER_NAME" 2>/dev/null; then
        echo -e "${RED}✗ El contenedor '${CONTAINER_NAME}' no existe.${RESET}"
        exit 1
    fi
    echo -e "${CYAN}:: Mostrando logs en vivo de '${CONTAINER_NAME}' (Ctrl+C para salir)...${RESET}"
    podman logs -f "$CONTAINER_NAME"
}

# Parsing de argumentos CLI
while [[ $# -gt 0 ]]; do
    case "$1" in
        -p|--port)
            CUSTOM_PORT="$2"
            shift 2
            ;;
        -s|--start-port)
            START_PORT="$2"
            shift 2
            ;;
        -e|--end-port)
            END_PORT="$2"
            shift 2
            ;;
        -b|--bind)
            BIND_IP="$2"
            shift 2
            ;;
        -n|--name)
            CONTAINER_NAME="$2"
            shift 2
            ;;
        -i|--image)
            IMAGE_NAME="$2"
            shift 2
            ;;
        --no-cache)
            NO_CACHE=true
            shift
            ;;
        --build-only)
            BUILD_ONLY=true
            shift
            ;;
        --stop)
            cmd_stop
            exit 0
            ;;
        --restart)
            # Extraer puerto actual si existe
            if podman container exists "$CONTAINER_NAME" 2>/dev/null; then
                EXISTING_PORT=$(podman inspect "$CONTAINER_NAME" --format '{{(index (index .NetworkSettings.Ports "80/tcp") 0).HostPort}}' 2>/dev/null || echo "")
                if [ -n "$EXISTING_PORT" ]; then
                    CUSTOM_PORT="$EXISTING_PORT"
                fi
            fi
            cmd_stop
            shift
            ;;
        --status)
            cmd_status
            exit 0
            ;;
        --duckdns)
            "${SCRIPT_DIR}/scripts/duckdns-sync.sh"
            exit 0
            ;;
        --duckdns-status)
            "${SCRIPT_DIR}/scripts/duckdns-sync.sh" --status
            exit 0
            ;;
        --logs)
            cmd_logs
            exit 0
            ;;
        -h|--help)
            print_help
            exit 0
            ;;
        *)
            echo -e "${RED}Opción desconocida: $1${RESET}"
            print_help
            exit 1
            ;;
    esac
done

# ==============================================================================
# FLUJO PRINCIPAL DE DESPLIEGUE
# ==============================================================================
print_banner

# 1. Comprobar disponibilidad de Podman
if ! command -v podman >/dev/null 2>&1; then
    echo -e "${RED}${BOLD}✗ Error fatal: Podman no está instalado o no se encuentra en el PATH.${RESET}"
    echo -e "Por favor, instálalo en tu servidor (ej: 'sudo apt install podman' o 'sudo pacman -S podman')."
    exit 1
fi

# 2. Construir la imagen
build_image

if [ "$BUILD_ONLY" = true ]; then
    echo -e "${GREEN}✓ Modo --build-only completado. Imagen lista.${RESET}"
    exit 0
fi

# 3. Determinar puerto de despliegue
SELECTED_PORT=""
echo -e "${BLUE}:: [2/4] Determinando puerto de red libre para evitar colisiones...${RESET}"

# Si el contenedor ya existía y estaba activo en un puerto, recordar ese puerto
PREV_PORT=""
if podman container exists "$CONTAINER_NAME" 2>/dev/null; then
    PREV_PORT=$(podman inspect "$CONTAINER_NAME" --format '{{(index (index .NetworkSettings.Ports "80/tcp") 0).HostPort}}' 2>/dev/null || echo "")
fi

if [ -n "$CUSTOM_PORT" ]; then
    echo -e "${CYAN}→ Validando puerto solicitado manualmente: ${BOLD}${CUSTOM_PORT}${RESET}"
    # Si el puerto solicitado era el del propio contenedor que vamos a reemplazar, está bien
    if [ "$CUSTOM_PORT" != "$PREV_PORT" ] && is_port_in_use "$CUSTOM_PORT"; then
        PROC_NAME=$(get_port_process "$CUSTOM_PORT")
        echo -e "${RED}✗ Error: El puerto $CUSTOM_PORT ya está ocupado por otro servicio ($PROC_NAME).${RESET}"
        echo -e "Selecciona otro puerto o ejecuta el script sin '-p' para autodetectar."
        exit 1
    fi
    SELECTED_PORT="$CUSTOM_PORT"
else
    # Si no se pasó un puerto fijo, pero el contenedor anterior ya tenía uno asignado y sigue siendo libre
    if [ -n "$PREV_PORT" ]; then
        echo -e "${GRAY}→ Contenedor previo detectado en el puerto ${PREV_PORT}.${RESET}"
        # Parar temporalmente el anterior para comprobar si su puerto queda libre
        echo -e "${GRAY}→ Liberando instancia previa para actualizar...${RESET}"
        podman stop -t 5 "$CONTAINER_NAME" >/dev/null 2>&1 || true
        podman rm -f "$CONTAINER_NAME" >/dev/null 2>&1 || true

        if ! is_port_in_use "$PREV_PORT"; then
            SELECTED_PORT="$PREV_PORT"
            echo -e "${GREEN}✓ Reutilizando el puerto previo ${BOLD}${SELECTED_PORT}${RESET} para mantener las URLs activas."
        fi
    fi

    # Si aún no tenemos puerto, autodetectamos el primero libre
    if [ -z "$SELECTED_PORT" ]; then
        SELECTED_PORT=$(find_available_port "$START_PORT" "$END_PORT")
    fi
fi

if [ -z "$SELECTED_PORT" ]; then
    echo -e "${RED}✗ No se pudo asignar un puerto válido.${RESET}"
    exit 1
fi

# 4. Detener contenedor antiguo si no se había detenido antes
echo -e "${BLUE}:: [3/4] Lanzando nuevo contenedor en el puerto ${BOLD}${SELECTED_PORT}${RESET}...${RESET}"
if podman container exists "$CONTAINER_NAME" 2>/dev/null; then
    podman stop -t 5 "$CONTAINER_NAME" >/dev/null 2>&1 || true
    podman rm -f "$CONTAINER_NAME" >/dev/null 2>&1 || true
fi

# 5. Ejecutar contenedor Podman
CONTAINER_ID=$(podman run -d \
    --name "$CONTAINER_NAME" \
    --restart unless-stopped \
    -p "${BIND_IP}:${SELECTED_PORT}:80" \
    "$IMAGE_NAME")

HOST_IP=$(get_host_ip)

# 6. Comprobar salud
verify_health "$SELECTED_PORT"

# 7. Resumen de despliegue
echo ""
echo -e "${GREEN}${BOLD}═══════════════════════════════════════════════════════════════${RESET}"
echo -e "${GREEN}${BOLD}      🚀 ¡DESPLIEGUE EN PRODUCCIÓN COMPLETADO CON ÉXITO!      ${RESET}"
echo -e "${GREEN}${BOLD}═══════════════════════════════════════════════════════════════${RESET}"
echo ""
echo -e "  ${BOLD}Contenedor:${RESET}     ${CYAN}${CONTAINER_NAME}${RESET} (${CONTAINER_ID:0:12})"
echo -e "  ${BOLD}Puerto Host:${RESET}    ${YELLOW}${SELECTED_PORT}${RESET} ${GRAY}(Mapeado al puerto 80 del contenedor)${RESET}"
echo -e "  ${BOLD}URL Local:${RESET}      ${GREEN}http://localhost:${SELECTED_PORT}/${RESET}"
echo -e "  ${BOLD}URL de Red:${RESET}     ${GREEN}http://${HOST_IP}:${SELECTED_PORT}/${RESET}"
echo -e "  ${BOLD}URL Pública:${RESET}    ${CYAN}https://garbisoft.duckdns.org/${RESET} ${GRAY}(Nginx Proxy Manager)${RESET}"
echo ""
echo -e "${BOLD}Comandos de gestión rápida:${RESET}"
echo -e "  ${GRAY}● Ver logs:${RESET}       ./deploy.sh --logs"
echo -e "  ${GRAY}● Consultar:${RESET}     ./deploy.sh --status"
echo -e "  ${GRAY}● DuckDNS Sync:${RESET}  ./deploy.sh --duckdns"
echo -e "  ${GRAY}● Reiniciar:${RESET}     ./deploy.sh --restart"
echo -e "  ${GRAY}● Detener:${RESET}       ./deploy.sh --stop"
echo -e "${GREEN}${BOLD}═══════════════════════════════════════════════════════════════${RESET}"
echo ""
