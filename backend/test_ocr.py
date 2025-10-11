from PIL import Image
import pytesseract

pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

image_path = r"C:\Users\ADMIN\Desktop\javaaaaaa.png"
text = pytesseract.image_to_string(Image.open(image_path))
print(text)
