import os

# Get the current folder where the script is located
folder_path = os.path.dirname(os.path.abspath(__file__))

# Supported image extensions
image_extensions = (".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp")

# Get all image files in the current folder
images = [f for f in os.listdir(folder_path) if f.lower().endswith(image_extensions)]

# Sort to maintain consistent order
images.sort()

# Rename files sequentially
for index, filename in enumerate(images, start=1):
    ext = os.path.splitext(filename)[1]  # get file extension
    new_name = f"{index}{ext}"
    old_path = os.path.join(folder_path, filename)
    new_path = os.path.join(folder_path, new_name)
    os.rename(old_path, new_path)

print("✅ All images renamed successfully in the current folder!")
