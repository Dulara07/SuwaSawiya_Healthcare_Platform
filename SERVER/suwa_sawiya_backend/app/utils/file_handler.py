"""File handling utilities"""
import os
from werkzeug.utils import secure_filename
from werkzeug.datastructures import FileStorage


def allowed_file(filename, allowed_extensions):
    """Check if file extension is allowed"""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in allowed_extensions


def save_uploaded_file(file, upload_folder, allowed_extensions):
    """Save uploaded file and return file path"""
    if not isinstance(file, FileStorage):
        return None, 'Invalid file'
    
    if file.filename == '':
        return None, 'No file selected'
    
    if not allowed_file(file.filename, allowed_extensions):
        return None, f'File type not allowed. Allowed types: {", ".join(allowed_extensions)}'
    
    try:
        filename = secure_filename(file.filename)
        # Add timestamp to filename to make it unique
        import time
        filename = f"{int(time.time())}_{filename}"
        
        os.makedirs(upload_folder, exist_ok=True)
        file_path = os.path.join(upload_folder, filename)
        file.save(file_path)
        
        return file_path, None
    except Exception as e:
        return None, str(e)


def delete_file(file_path):
    """Delete a file"""
    try:
        if os.path.exists(file_path):
            os.remove(file_path)
            return True
    except Exception as e:
        print(f"Error deleting file: {e}")
    return False
