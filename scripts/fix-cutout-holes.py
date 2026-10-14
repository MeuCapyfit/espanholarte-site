#!/usr/bin/env python3
"""Corrige "furos" de recorte (quadradinhos que deixam aparecer o fundo colorido) nas fotos com transparência.
Preenche somente regiões transparentes PEQUENAS ou FINAS fora do fundo principal (botões, tecido, tênis, faixas no chão),
reconstruindo a cor a partir do entorno. Vãos grandes (entre braço e corpo, sombra) continuam transparentes.
Uso: python3 scripts/fix-cutout-holes.py  (reescreve assets/img/bettiana-{maos,queixo,banco,em-pe,pensando}{,-sm}.webp)"""
import numpy as np, cv2
from PIL import Image
from scipy import ndimage as ndi
NAMES = ['maos', 'queixo', 'banco', 'em-pe', 'pensando']
for n in NAMES:
    for suf, limit, thin in (('', 1500, 7.0), ('-sm', 600, 4.5)):
        f = f'assets/img/bettiana-{n}{suf}.webp'
        rgba = np.array(Image.open(f).convert('RGBA'))
        a = rgba[:, :, 3]
        mask = a < 250
        lab, nl = ndi.label(mask)
        sizes = ndi.sum(mask, lab, range(1, nl + 1))
        background = int(np.argmax(sizes)) + 1  # o fundo removido (maior região transparente): nunca preencher
        fill = np.zeros_like(mask)
        count = 0
        for i in range(1, nl + 1):
            if i == background: continue
            m = lab == i
            # pequenas (botões, tecido, tênis, manchas na borda) OU faixas finas (resto do recorte no chão)
            if m.sum() < limit or ndi.distance_transform_edt(m).max() <= thin: fill |= m; count += 1
        if not count: print(f, 'nada a corrigir'); continue
        # inclui a franja semitransparente colada ao furo (o "quadradinho" tem borda parcialmente transparente)
        grow = ndi.binary_dilation(fill, iterations=2) & (a < 250)
        fill |= grow
        rgb = np.ascontiguousarray(rgba[:, :, :3])
        out = cv2.inpaint(rgb, fill.astype(np.uint8) * 255, 3, cv2.INPAINT_TELEA)
        rgba[:, :, :3] = np.where(fill[:, :, None], out, rgba[:, :, :3])
        rgba[:, :, 3] = np.where(fill, 255, a)
        Image.fromarray(rgba, 'RGBA').save(f, 'WEBP', quality=90, method=6, alpha_quality=100)
        print(f, 'furos preenchidos:', count)
