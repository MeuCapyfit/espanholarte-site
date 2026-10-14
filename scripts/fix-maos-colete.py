#!/usr/bin/env python3
"""Limpa a borda esfumaçada (pixels semitransparentes que deixavam o fundo amarelo aparecer) no canto do colete,
embaixo do braço, na foto 'maos' (Hablar). Mexe só numa caixa pequena; o resto da imagem não muda.
Uso: python3 scripts/fix-maos-colete.py"""
import numpy as np, cv2
from PIL import Image
from scipy import ndimage as ndi
# caixa (x0,y0,x1,y1) na imagem grande; a versão -sm usa a mesma caixa na escala 365/589
BOX = (138, 584, 196, 646)
for suf, scale in (('', 1.0), ('-sm', 365 / 589)):
    f = f'assets/img/bettiana-maos{suf}.webp'
    im = np.array(Image.open(f).convert('RGBA'))
    x0, y0, x1, y1 = [int(round(v * scale)) for v in BOX]
    a = im[:, :, 3].astype(np.float32)
    region = np.zeros(a.shape, bool); region[y0:y1, x0:x1] = True
    soft = region & (a < 250)
    # silhueta limpa: contorno binário suavizado (sem franja irregular)
    solid = (a >= 128)
    solid = ndi.binary_opening(ndi.binary_closing(solid, iterations=2), iterations=1)
    sm = cv2.GaussianBlur(solid.astype(np.float32), (0, 0), 0.9 * max(scale, .6)) * 255
    newa = np.where(region & (a < 250), sm, a)
    # cor: nos pixels semitransparentes, usa só a cor dos vizinhos opacos (sem o tom amarelo do fundo)
    rgb = np.ascontiguousarray(im[:, :, :3])
    out = cv2.inpaint(rgb, (soft & (newa > 0)).astype(np.uint8) * 255, 3, cv2.INPAINT_TELEA)
    im[:, :, :3] = np.where((soft & (newa > 0))[:, :, None], out, im[:, :, :3])
    im[:, :, 3] = np.clip(newa, 0, 255).astype(np.uint8)
    Image.fromarray(im, 'RGBA').save(f, 'WEBP', quality=90, method=6, alpha_quality=100)
    print(f, 'ok', (x0, y0, x1, y1))
