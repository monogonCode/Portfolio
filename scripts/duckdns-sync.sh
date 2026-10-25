#!/usr/bin/env bash
# ==============================================================================
# DuckDNS Auto-Sync - Sincronizador Automático de IP Dinámica
# ==============================================================================
# Autor: Martín Alejandro Garbiso
# Proyecto: Portfolio Retro OS & Garbisoft
# Descripción: Comprueba la IP pública actual y la compara con la registrada
#              en DuckDNS (garbisoft.duckdns.org). Si difieren, actualiza
#              automáticamente DuckDNS mediante su API HTTP.
# ==============================================================================

set -eo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

# Cargar variables de entorno si existe fichero de configuración
ENV_FILE="${ROOT_DIR}/.duckdns.env"
if [ -f "$ENV_FILE" ]; then
    # shellcheck disable=SC1090
    source "$ENV_FILE"
fi

# Configuración (variables de entorno o valores predeterminados)
DUCKDNS_DOMAIN="${DUCKDNS_DOMAIN:-garbisoft}"
DUCKDNS_TOKEN="${DUCKDNS_TOKEN:-9306ffa5-cc0a-42e4-8ee1-595250aae823}"
FULL_DOMAIN="${DUCKDNS_DOMAIN}.duckdns.org"
LOG_FILE="${DUCKDNS_LOG_FILE:-${ROOT_DIR}/duckdns.log}"
SERVICE_NAME="duckdns-sync"

# Paleta de colores
BOLD='\033[1m'
RESET='\033[0m'
CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
GRAY='\033[0;90m'
BLUE='\033[0;34m'

log_msg() {
    local level="$1"
    local message="$2"
    local timestamp
    timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo "[$timestamp] [$level] $message" >> "$LOG_FILE"
}

# Validador de formato IPv4
is_valid_ipv4() {
    local ip="$1"
    local rx='^([0-9]{1,3}\.){3}[0-9]{1,3}$'
    if [[ $ip =~ $rx ]]; then
        local IFS='.'
        read -r -a octets <<< "$ip"
        for octet in "${octets[@]}"; do
            if (( octet > 255 )); then
                return 1
            fi
        done
        return 0
    fi
    return 1
}

# Obtener IP pública actual del host
get_current_public_ip() {
    local ip=""
    local providers=(
        "https://api4.ipify.org"
        "https://icanhazip.com"
        "https://ifconfig.me/ip"
        "https://checkip.amazonaws.com"
    )

    for url in "${providers[@]}"; do
        ip=$(curl -4 -s --max-time 4 "$url" 2>/dev/null | tr -d '[:space:]')
        if is_valid_ipv4 "$ip"; then
            echo "$ip"
            return 0
        fi
    done

    return 1
}

# Obtener IP registrada en DuckDNS sin usar caché DNS local
get_duckdns_registered_ip() {
    local ip=""

    # 1. Intentar mediante Google DNS-over-HTTPS (DoH)
    ip=$(curl -s --max-time 4 -H "Accept: application/dns-json" "https://dns.google/resolve?name=${FULL_DOMAIN}&type=A" 2>/dev/null | \
        python3 -c "import sys, json; data=json.load(sys.stdin); ans=data.get('Answer', [{}]); print(ans[0].get('data', ''))" 2>/dev/null || echo "")

    if is_valid_ipv4 "$ip"; then
        echo "$ip"
        return 0
    fi

    # 2. Intentar mediante Cloudflare DNS-over-HTTPS (DoH)
    ip=$(curl -s --max-time 4 -H "Accept: application/dns-json" "https://cloudflare-dns.com/dns-query?name=${FULL_DOMAIN}&type=A" 2>/dev/null | \
        python3 -c "import sys, json; data=json.load(sys.stdin); ans=data.get('Answer', [{}]); print(ans[0].get('data', ''))" 2>/dev/null || echo "")

    if is_valid_ipv4 "$ip"; then
        echo "$ip"
        return 0
    fi

    # 3. Fallback al resolver nativo del sistema
    ip=$(python3 -c "import socket; print(socket.gethostbyname('${FULL_DOMAIN}'))" 2>/dev/null || echo "")
    if is_valid_ipv4 "$ip"; then
        echo "$ip"
        return 0
    fi

    return 1
}

# Actualizar IP en DuckDNS
update_duckdns() {
    local new_ip="$1"
    local url="https://www.duckdns.org/update?domains=${DUCKDNS_DOMAIN}&token=${DUCKDNS_TOKEN}&ip=${new_ip}"
    local response
    response=$(curl -s --max-time 10 "$url" 2>/dev/null | tr -d '[:space:]')

    if [ "$response" = "OK" ]; then
        return 0
    else
        log_msg "ERROR" "Respuesta inesperada de DuckDNS API: '$response'"
        return 1
    fi
}

# Ejecutar sincronización
sync_duckdns() {
    local force="${1:-false}"
    local quiet="${2:-false}"

    if [ "$quiet" = false ]; then
        echo -e "${BLUE}:: [DuckDNS] Verificando sincronización de IP para ${BOLD}${FULL_DOMAIN}${RESET}...${RESET}"
    fi

    # Obtener IP pública actual
    local current_ip
    if ! current_ip=$(get_current_public_ip); then
        local err="No se pudo determinar la IP pública actual desde los proveedores de red."
        if [ "$quiet" = false ]; then
            echo -e "${RED}✗ Error: ${err}${RESET}"
        fi
        log_msg "ERROR" "$err"
        return 1
    fi

    # Obtener IP en DuckDNS
    local duckdns_ip
    duckdns_ip=$(get_duckdns_registered_ip || echo "NO_RESOLVIBLE")

    if [ "$quiet" = false ]; then
        echo -e "  ● IP Pública Actual:   ${CYAN}${current_ip}${RESET}"
        echo -e "  ● IP en DuckDNS:       ${YELLOW}${duckdns_ip}${RESET}"
    fi

    if [ "$force" = false ] && [ "$current_ip" = "$duckdns_ip" ]; then
        if [ "$quiet" = false ]; then
            echo -e "${GREEN}✓ La IP ya está sincronizada (${current_ip}). No es necesario actualizar.${RESET}"
        fi
        log_msg "INFO" "Sincronizado: ${current_ip} == ${duckdns_ip}"
        return 0
    fi

    # Si difieren o se fuerza
    local reason="IP desactualizada (${duckdns_ip} -> ${current_ip})"
    if [ "$force" = true ]; then
        reason="Actualización forzada manualmente"
    fi

    if [ "$quiet" = false ]; then
        echo -e "${YELLOW}⚡ Sincronizando IP con DuckDNS (${reason})...${RESET}"
    fi

    if update_duckdns "$current_ip"; then
        if [ "$quiet" = false ]; then
            echo -e "${GREEN}${BOLD}✓ ¡DuckDNS actualizado con éxito a la IP ${current_ip}!${RESET}"
        fi
        log_msg "UPDATE" "DuckDNS actualizado a ${current_ip} (Previa: ${duckdns_ip}, Motivo: ${reason})"
        return 0
    else
        if [ "$quiet" = false ]; then
            echo -e "${RED}${BOLD}✗ Error al actualizar DuckDNS. Revisa el token o la conexión.${RESET}"
        fi
        log_msg "ERROR" "Fallo al enviar actualización a DuckDNS para la IP ${current_ip}"
        return 1
    fi
}

# Instalar systemd timer de usuario
install_systemd() {
    echo -e "${BLUE}:: Configurando servicio y temporizador en systemd (--user)...${RESET}"
    local user_unit_dir="${HOME}/.config/systemd/user"
    mkdir -p "$user_unit_dir"

    local service_file="${user_unit_dir}/${SERVICE_NAME}.service"
    local timer_file="${user_unit_dir}/${SERVICE_NAME}.timer"

    cat <<EOF > "$service_file"
[Unit]
Description=DuckDNS Dynamic DNS Sync (${FULL_DOMAIN})
After=network-online.target
Wants=network-online.target

[Service]
Type=oneshot
ExecStart=${SCRIPT_DIR}/duckdns-sync.sh --quiet
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=default.target
EOF

    cat <<EOF > "$timer_file"
[Unit]
Description=DuckDNS Sync Timer (ejecuta cada 5 minutos)

[Timer]
OnBootSec=1min
OnUnitActiveSec=5min
Persistent=true

[Install]
WantedBy=timers.target
EOF

    systemctl --user daemon-reload
    systemctl --user enable --now "${SERVICE_NAME}.timer"

    echo -e "${GREEN}✓ Servicio y Timer instalados y activados en systemd (--user).${RESET}"
    echo -e "  ● Frecuencia: Cada 5 minutos (y 1 minuto tras arranque)"
    echo -e "  ● Consulta de estado: systemctl --user status ${SERVICE_NAME}.timer"
    echo -e "  ● Logs: journalctl --user -u ${SERVICE_NAME}.service -n 20"
}

# Desinstalar systemd timer de usuario
uninstall_systemd() {
    echo -e "${YELLOW}:: Desinstalando timer y servicio de DuckDNS...${RESET}"
    systemctl --user stop "${SERVICE_NAME}.timer" 2>/dev/null || true
    systemctl --user disable "${SERVICE_NAME}.timer" 2>/dev/null || true
    rm -f "${HOME}/.config/systemd/user/${SERVICE_NAME}.service"
    rm -f "${HOME}/.config/systemd/user/${SERVICE_NAME}.timer"
    systemctl --user daemon-reload
    echo -e "${GREEN}✓ Eliminado correctamente de systemd.${RESET}"
}

# Instalar en Crontab del usuario
install_cron() {
    echo -e "${BLUE}:: Configurando tarea periódica en Crontab...${RESET}"
    local cron_cmd="*/5 * * * * ${SCRIPT_DIR}/duckdns-sync.sh --quiet >> /dev/null 2>&1"
    local existing_cron
    existing_cron=$(crontab -l 2>/dev/null || echo "")

    if echo "$existing_cron" | grep -F "duckdns-sync.sh" >/dev/null 2>&1; then
        echo -e "${YELLOW}ℹ La tarea ya existe en el crontab.${RESET}"
    else
        (echo "$existing_cron"; echo "$cron_cmd") | crontab -
        echo -e "${GREEN}✓ Entrada añadida a crontab (cada 5 minutos).${RESET}"
    fi
}

# Desinstalar de Crontab
uninstall_cron() {
    echo -e "${YELLOW}:: Eliminando tarea de crontab...${RESET}"
    local existing_cron
    existing_cron=$(crontab -l 2>/dev/null || echo "")
    if [ -n "$existing_cron" ]; then
        echo "$existing_cron" | grep -v "duckdns-sync.sh" | crontab - 2>/dev/null || crontab -r 2>/dev/null || true
        echo -e "${GREEN}✓ Tarea eliminada de crontab.${RESET}"
    fi
}

# Modo demonio (bucle en background)
run_daemon() {
    local interval="${1:-300}"
    echo -e "${CYAN}:: Iniciando demonio DuckDNS Sync (intervalo: ${interval}s)...${RESET}"
    log_msg "DAEMON" "Demonio iniciado con intervalo de ${interval} segundos"

    while true; do
        sync_duckdns false true || true
        sleep "$interval"
    done
}

# Mostrar estado
show_status() {
    echo -e "${CYAN}${BOLD}"
    echo "  ╔═══════════════════════════════════════════════════════════════╗"
    echo "  ║             ESTADO DE SINCRONIZACIÓN DUCKDNS                  ║"
    echo "  ╚═══════════════════════════════════════════════════════════════╝"
    echo -e "${RESET}"
    echo -e "  Dominio:        ${BOLD}${FULL_DOMAIN}${RESET}"
    echo -e "  Token:          ${GRAY}${DUCKDNS_TOKEN:0:8}...${DUCKDNS_TOKEN: -4}${RESET}"

    local cur_ip
    cur_ip=$(get_current_public_ip || echo "DESCONOCIDA")
    local d_ip
    d_ip=$(get_duckdns_registered_ip || echo "NO_RESOLVIBLE")

    echo -e "  IP Pública:     ${CYAN}${cur_ip}${RESET}"
    echo -e "  IP DuckDNS:     ${YELLOW}${d_ip}${RESET}"

    if [ "$cur_ip" = "$d_ip" ] && [ "$cur_ip" != "DESCONOCIDA" ]; then
        echo -e "  Sincronización: ${GREEN}${BOLD}✓ AL DÍA (Sincronizado)${RESET}"
    else
        echo -e "  Sincronización: ${RED}${BOLD}✗ DESINCRONIZADO${RESET}"
    fi

    echo ""
    echo -e "${BOLD}Temporizador Systemd:${RESET}"
    if systemctl --user is-active "${SERVICE_NAME}.timer" >/dev/null 2>&1; then
        echo -e "  Estado Timer:   ${GREEN}${BOLD}● ACTIVO (Ejecutándose en segundo plano)${RESET}"
    else
        echo -e "  Estado Timer:   ${GRAY}● Inactivo / No configurado${RESET}"
    fi

    echo ""
    if [ -f "$LOG_FILE" ]; then
        echo -e "${BOLD}ÚLTIMAS LÍNEAS DEL REGISTRO (${LOG_FILE}):${RESET}"
        tail -n 5 "$LOG_FILE" | sed 's/^/  │ /'
    fi
    echo ""
}

# Ayuda
print_help() {
    echo -e "${BOLD}USO:${RESET}"
    echo -e "  ./scripts/duckdns-sync.sh [OPCIÓN]"
    echo ""
    echo -e "${BOLD}OPCIONES:${RESET}"
    echo -e "  ${GREEN}(sin argumentos)${RESET}     Comprueba y sincroniza la IP si difieren"
    echo -e "  ${GREEN}--status${RESET}             Muestra el estado detallado de IP y sincronización"
    echo -e "  ${GREEN}--check${RESET}              Comprueba si coinciden sin realizar cambios"
    echo -e "  ${GREEN}--force${RESET}              Fuerza la actualización en DuckDNS aunque coincidan"
    echo -e "  ${GREEN}--quiet${RESET}              Ejecuta sin salida por consola (ideal para timers/crons)"
    echo -e "  ${YELLOW}--install-systemd${RESET}    Instala y activa timer de systemd (--user) cada 5 min"
    echo -e "  ${YELLOW}--uninstall-systemd${RESET}  Elimina el timer y servicio de systemd (--user)"
    echo -e "  ${YELLOW}--install-cron${RESET}       Instala la tarea periódica en Crontab (cada 5 min)"
    echo -e "  ${YELLOW}--uninstall-cron${RESET}     Elimina la tarea de Crontab"
    echo -e "  ${CYAN}--daemon [segundos]${RESET}  Ejecuta en bucle continuo (por defecto 300s)"
    echo -e "  ${GRAY}-h, --help${RESET}           Muestra este mensaje de ayuda"
    echo ""
}

# Gestión de parámetros
case "${1:-}" in
    --status)
        show_status
        ;;
    --check)
        sync_duckdns false false
        ;;
    --force)
        sync_duckdns true false
        ;;
    --quiet)
        sync_duckdns false true
        ;;
    --install-systemd)
        install_systemd
        ;;
    --uninstall-systemd)
        uninstall_systemd
        ;;
    --install-cron)
        install_cron
        ;;
    --uninstall-cron)
        uninstall_cron
        ;;
    --daemon)
        run_daemon "${2:-300}"
        ;;
    -h|--help)
        print_help
        ;;
    "")
        sync_duckdns false false
        ;;
    *)
        echo -e "${RED}Opción no reconocida: $1${RESET}"
        print_help
        exit 1
        ;;
esac
