#!/usr/bin/env python3
"""Devolve o pedaço do colete que o recorte apagou embaixo do braço (foto 'maos', Hablar) e que deixava um
"entalhe" amarelo. A foto original ainda guarda, por baixo da transparência, a cor real do tecido; usamos essa
cor onde ela é claramente de colete (clara e pouco saturada) e deixamos o resto transparente.
Mexe só numa caixa pequena. Precisa da versão ORIGINAL das imagens (commit 934755f).
Uso: python3 scripts/fix-maos-colete.py"""
import io, subprocess, numpy as np, cv2
from PIL import Image
from scipy import ndimage as ndi
ORIG_COMMIT = '934755f'
BOX = (104, 562, 206, 672)
LINE = ((148, 607), (128, 690))  # contorno do colete: ponto sob o cotovelo -> ponto da borda limpa embaixo  # x0,y0,x1,y1 na imagem grande; a -sm usa a escala 365/589
for suf, scale in (('', 1.0), ('-sm', 365 / 589)):
    f = f'assets/img/bettiana-maos{suf}.webp'
    cur = np.array(Image.open(f).convert('RGBA'))
    raw = subprocess.check_output(['git', 'show', f'{ORIG_COMMIT}:{f}'])
    orig = np.array(Image.open(io.BytesIO(raw)).convert('RGBA'))
    x0, y0, x1, y1 = [int(round(v * scale)) for v in BOX]
    reg = np.zeros(cur.shape[:2], bool); reg[y0:y1, x0:x1] = True
    a = cur[:, :, 3]
    rgb = orig[:, :, :3].astype(int)
    bright = rgb.mean(axis=2); sat = rgb.max(axis=2) - rgb.min(axis=2)
    vest = (bright > 178) & (sat < 45)          # cor de colete clara (o fundo preenchido é cinza-escuro/marrom)
    # só à direita da linha do contorno real do colete (do cotovelo até a borda limpa de baixo): evita pegar fundo claro
    yy, xx = np.mgrid[0:cur.shape[0], 0:cur.shape[1]]
    (lx0, ly0), (lx1, ly1) = [(v[0] * scale, v[1] * scale) for v in LINE]
    edge_x = lx0 + (yy - ly0) * (lx1 - lx0) / (ly1 - ly0)
    right_of_edge = xx >= edge_x - 0.5
    cand = reg & (a < 250) & vest & right_of_edge
    cand = ndi.binary_closing(cand, iterations=2) & reg & (a < 250)
    cand = ndi.binary_opening(cand, iterations=1)
    # fecha buracos pequenos que sobrem dentro do colete (pontinhas de fundo)
    solid = cand | (a >= 250)
    cand |= ndi.binary_fill_holes(solid) & ~solid & reg
    # recupera a cor original e suaviza levemente (a cor sob a transparência vem em blocos)
    sm = cv2.GaussianBlur(orig[:, :, :3], (0, 0), 1.2)
    cur[:, :, :3] = np.where(cand[:, :, None], sm, cur[:, :, :3])
    # silhueta suave: bordas com leve degradê em vez de serrilhado
    alpha = np.where(cand, 255, a).astype(np.float32)
    soft = cv2.GaussianBlur(alpha, (0, 0), 0.8 * max(scale, .6))
    alpha = np.where(reg, np.maximum(alpha, soft * (a >= 0)), alpha)
    cur[:, :, 3] = np.clip(alpha, 0, 255).astype(np.uint8)
    Image.fromarray(cur, 'RGBA').save(f, 'WEBP', quality=90, method=6, alpha_quality=100)
    print(f, 'pixels devolvidos ao colete:', int(cand.sum()))
