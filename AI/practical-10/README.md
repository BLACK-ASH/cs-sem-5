# Practical 10 — Cat vs Dog Image Classifier (no training)

Classify any image as cat or dog using a pretrained MobileNetV2 (ImageNet). No dataset, no training, no labels.

## Usage

```bash
python classify.py <image>
```

## Requirements

```bash
pip install tensorflow keras
```

First run downloads the pretrained weights (~15 MB) once.

## Notes

- Prints the detected breed/species and the verdict: `cat`, `dog`, or `neither` for non-cat/dog images.
- Works with JPEG, PNG, GIF, BMP, WebP.