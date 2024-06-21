from flask import Flask, request, redirect, url_for, render_template
import os

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads/'   # define an upload folder

# Ensure the upload folder exists
if not os.path.exists(app.config['UPLOAD_FOLDER']):
    os.makedirs(app.config['UPLOAD_FOLDER'])

@app.route('/')
def index():
    return render_template('maptile.html')   # load html template

@app.route('/upload', methods=['POST'])
def upload_file():
    print("Upload function called")
    if 'file' not in request.files:
        print("No file part")
        return 'No file part'
    file = request.files['file']
    if file.filename == '':
        print("No selected file")
        return 'No selected file'
    if file:
        filename = file.filename
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        print(f"File saved: {filepath}")
        return f'File uploaded successfully: {filename}'


if __name__ == '__main__':
    app.run(host="localhost", debug=True) 