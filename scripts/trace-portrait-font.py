"""Export the portrait's ASCII outlines; requires fontTools only for this step."""

import argparse
import json
from pathlib import Path

from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.ttLib import TTFont

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("font", type=Path, help="Path to LiberationMono-Bold.ttf")
parser.add_argument("output", type=Path, help="Output portrait-glyphs.json")
args = parser.parse_args()

font = TTFont(args.font)
glyphs = font.getGlyphSet()
cmap = font.getBestCmap()
paths = {}
for char in ".,:;i1tfLCG08@":
    pen = SVGPathPen(glyphs)
    glyphs[cmap[ord(char)]].draw(pen)
    paths[char] = pen.getCommands()

units = font["head"].unitsPerEm
result = {
    "source": "Liberation Mono Bold",
    "license": "SIL Open Font License 1.1; see portrait-glyphs.LICENSE.txt",
    "unitsPerEm": units,
    "advance": font["hmtx"].metrics[cmap[ord("@")]][0],
    "strokeWidth": units * 0.025,
    "paths": paths,
}
args.output.write_text(json.dumps(result, indent=2) + "\n")
