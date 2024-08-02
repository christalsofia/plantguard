import csv
import os
import numpy as np
from PIL import Image
from keras.models import load_model
from flask import Flask, request, render_template
from werkzeug.utils import secure_filename
from tensorflow.keras.preprocessing.image import load_img, img_to_array
app = Flask(__name__)

model = load_model('MobileNetModel.h5')
print('Model loaded. Check http://127.0.0.1:5000')

labels = {0: 'Healthy', 1: 'Powdery', 2: 'Rust'}

def getResult(image_path):
    img = load_img(image_path, target_size=(224,224))
    img = img.convert('RGB')
    img = img.resize((224, 224))
    x = img_to_array(img)
    x = x.astype('float32') / 255.
    x = np.expand_dims(x, axis=0)
    predictions = model.predict(x)[0]
    return predictions

@app.route('/', methods=['GET'])
@app.route('/index.html', methods=['GET'])
def index():
    return render_template('index.html')

@app.route('/about.html', methods=['GET'])
def about():
    return render_template('about.html')

@app.route('/source.html', methods=['GET'])
def source():
    return render_template('source.html')

@app.route('/detect.html', methods=['GET'])
def detect():
    return render_template('detect.html')

@app.route('/history.html', methods=['GET'])
def history():
    with open('history.csv', 'r') as file:
        reader = csv.reader(file)
        history = [{'filename': row[0], 'status': row[1]} for row in reader]

    return render_template('history.html', history=history)

@app.route('/delete_history', methods=['POST'])
def delete_history():
    basepath = os.path.dirname(__file__)
    csv_file = os.path.join(basepath, 'history.csv')
    upload_dir = os.path.join(basepath, 'static/uploads')

    if os.path.exists(csv_file):
        with open(csv_file, 'w') as file:
            pass

    if os.path.exists(upload_dir):
        for filename in os.listdir(upload_dir):
            file_path = os.path.join(upload_dir, filename)
            if os.path.isfile(file_path) or os.path.islink(file_path):
                os.unlink(file_path)

    with open(csv_file, 'r') as file:
        reader = csv.reader(file)
        history = [{'filename': row[0], 'status': row[1]} for row in reader]

    return render_template('history.html', history=history)

@app.route('/predict', methods=['GET', 'POST'])
def upload():
    if request.method == 'POST':
        f = request.files['file']
        basepath = os.path.dirname(__file__)
        file_path = os.path.join(
            basepath, 'static/uploads', secure_filename(f.filename))
        f.save(file_path)
        predictions=getResult(file_path)
        predictedLabel = labels[np.argmax(predictions)]
        confidence = np.max(predictions)
        displayLabel = f"{predictedLabel}<br>{confidence * 100:.2f}%"

        with open('history.csv', 'r') as file:
            history = list(csv.reader(file))
        
        if len(history) == 10:
            try:
                os.remove(os.path.join(basepath, 'static/uploads', history[0][0]))
            except FileNotFoundError:
                print(f"File {history[0][0]} not found")
            history = history[1:] 

        with open('history.csv', 'w', newline='') as file:
            writer = csv.writer(file)
            writer.writerows(history + [[os.path.basename(file_path), predictedLabel]])
        
        return str(displayLabel)
    return None

if __name__ == '__main__':
    app.run(debug=True)