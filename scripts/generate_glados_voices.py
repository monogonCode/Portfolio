#!/usr/bin/env python3
"""
Generador de voces de GLaDOS para el Portfolio de Martín.
Lee scripts/glados_quotes.json, sintetiza con Glad0sAsistant (Piper ONNX)
e inserta pausas exactas configuradas con [pausa:X].
"""

import sys
import os
import json
import re
import subprocess
import tempfile
from pathlib import Path

# Localización de Glad0sAsistant
GLADOS_PROJECT_DIR = '/home/martin/Proyectos/Desarrollo/Personal/Glad0sAsistant'
CONFIG_PATH = '/home/martin/.config/glados-assistant/config.json'
GLADOS_VENV_PYTHON = os.path.expanduser('~/.local/share/glados-assistant/venv/bin/python')

# Auto-reinvocación dentro del venv de Glad0sAsistant si se ejecuta con otro python
if os.path.exists(GLADOS_VENV_PYTHON) and sys.executable != GLADOS_VENV_PYTHON:
    os.execv(GLADOS_VENV_PYTHON, [GLADOS_VENV_PYTHON] + sys.argv)

sys.path.insert(0, GLADOS_PROJECT_DIR)

try:
    from glados.tts_clone import GLaDOSVoiceCloner
except ImportError as e:
    print(f"Error importando módulos de Glad0sAsistant: {e}")
    sys.exit(1)

def parse_spoken_segments(text: str):
    """
    Parsea texto con etiquetas [pausa:X] o [pause:X].
    Retorna una lista de tuplas: (fragmento_texto, segundos_pausa_posterior)
    """
    parts = re.split(r'\[(?:pausa|pause):\s*([0-9.]+)\s*\]', text, flags=re.IGNORECASE)
    segments = []
    for i in range(0, len(parts), 2):
        chunk = parts[i].strip()
        pause = float(parts[i+1]) if (i+1 < len(parts)) else 0.0
        if chunk:
            segments.append((chunk, pause))
    return segments

def main():
    root_dir = Path(__file__).resolve().parent.parent
    quotes_file = root_dir / 'scripts' / 'glados_quotes.json'

    if not quotes_file.exists():
        print(f"No se encontró el archivo de frases: {quotes_file}")
        sys.exit(1)

    with open(quotes_file, 'r', encoding='utf-8') as f:
        quotes = json.load(f)

    with open(CONFIG_PATH, 'r', encoding='utf-8') as f:
        config = json.load(f)

    tts_config = config.get('tts', {}).copy()
    tts_config['apply_audio_fx'] = False  # Voz pura de GLaDOS

    cloner = GLaDOSVoiceCloner(tts_config)
    print(f"✓ Modelo neuronal cargado: {cloner.piper_model_path}")
    print(f"✓ Procesando {len(quotes)} frases desde glados_quotes.json...\n")

    temp_dir = tempfile.mkdtemp(prefix="glados_cli_gen_")

    for item in quotes:
        qid = item.get('id', 'quote')
        desc = item.get('description', '')
        output_rel = item.get('output', f'public/audio/glados/{qid}.mp3')
        spoken_text = item.get('spoken', '')

        dest_file = root_dir / output_rel
        dest_file.parent.mkdir(parents=True, exist_ok=True)

        segments = parse_spoken_segments(spoken_text)
        print(f"[{qid}] {desc}")
        print(f"  Texto: \"{spoken_text}\"")

        filter_inputs = []
        ffmpeg_cmd = ["ffmpeg", "-y"]
        input_idx = 0

        for i, (chunk, pause_sec) in enumerate(segments):
            seg_wav = os.path.join(temp_dir, f"{qid}_seg_{i}.wav")
            cloner._synthesize_piper(chunk, seg_wav)

            if not os.path.exists(seg_wav):
                print(f"  ❌ Error sintetizando fragmento: '{chunk}'")
                continue

            ffmpeg_cmd.extend(["-i", seg_wav])
            filter_inputs.append(f"[{input_idx}:a]")
            input_idx += 1

            if pause_sec > 0.05:
                ffmpeg_cmd.extend(["-f", "lavfi", "-t", str(pause_sec), "-i", "anullsrc=r=22050:cl=mono"])
                filter_inputs.append(f"[{input_idx}:a]")
                input_idx += 1

        if not filter_inputs:
            continue

        filter_graph = f"{''.join(filter_inputs)}concat=n={len(filter_inputs)}:v=0:a=1[outa]"
        ffmpeg_cmd.extend([
            "-filter_complex", filter_graph,
            "-map", "[outa]",
            "-c:a", "libmp3lame",
            "-q:a", "2",
            str(dest_file)
        ])

        res = subprocess.run(ffmpeg_cmd, capture_output=True, text=True)
        if res.returncode == 0:
            print(f"  ✓ Generado: {output_rel} ({os.path.getsize(dest_file)} bytes)\n")
        else:
            print(f"  ❌ Error FFmpeg: {res.stderr}\n")

    print("✨ ¡Proceso completado con éxito! Todos los audios están listos en public/audio/glados/.")

if __name__ == '__main__':
    main()
