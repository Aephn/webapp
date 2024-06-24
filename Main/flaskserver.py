from flask import Flask, request, redirect, url_for, render_template
import os

# maybe good to look into: https://flask-wtf.readthedocs.io/en/1.2.x/
# might help me simplify some things here in regard to the flask server.
# Helpful: https://blog.miguelgrinberg.com/post/handling-file-uploads-with-flask

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads/'   # define an upload folder
app.config['MAX_CONTENT_LENGTH'] = 1000 * 1000 # max file upload size of 1 mb.
Allowed_Extensions = {'jpg', 'png', 'jpeg'}   # allowed file extensions


# Ensure the upload folder exists
if not os.path.exists(app.config['UPLOAD_FOLDER']):
    os.makedirs(app.config['UPLOAD_FOLDER'])

def allowed_file(filename):   # check if the file submitted is valid.
    return '.' in filename and \
        filename.split('.', 1)[1].lower() in Allowed_Extensions


@app.route('/')
def index():
    return render_template('maptile.html')   # load html template


@app.route('/upload', methods=['POST'])
def upload_file():
    print("Upload function called")

    if 'file' not in request.files:
        print("No files!")
        return 'No files!'
    
    # uploaded_files = request.files['file']

    for upload in request.files.getlist('file'):
        if upload.filename == '':
            print("Error: Blank File!")
            continue   # check if this is bad!
            # return 'Error: Blank File!'
    
        if upload and allowed_file(upload.filename):
            filename = upload.filename
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            upload.save(filepath)
            print(f"File saved: {filepath}")
            # return redirect(url_for("maptile"))  # error here.
            return f'File uploaded successfully: {filename}'   # need to figure out a way to return this correctly w/multiple files.
    
    return 'No Valid Files Submitted'

if __name__ == '__main__':
    app.run(host="localhost", debug=True)