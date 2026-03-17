export const fileOrganizerCode = {
  code: `import os
import shutil
from pathlib import Path
from datetime import datetime
import time
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

class FileOrganizer(FileSystemEventHandler):
    """Automatically organize files into folders based on type and date."""
    
    def __init__(self, watch_path):
        self.watch_path = Path(watch_path)
        
        # Define file categories
        self.file_categories = {
            'Images': ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg'],
            'Documents': ['.pdf', '.doc', '.docx', '.txt', '.xlsx', '.pptx'],
            'Videos': ['.mp4', '.avi', '.mov', '.mkv', '.flv'],
            'Audio': ['.mp3', '.wav', '.flac', '.aac'],
            'Archives': ['.zip', '.rar', '.7z', '.tar', '.gz'],
            'Code': ['.py', '.js', '.html', '.css', '.java', '.cpp']
        }
    
    def on_created(self, event):
        """Handle new file creation events."""
        if event.is_directory:
            return
        
        self.organize_file(event.src_path)
    
    def organize_file(self, file_path):
        """Move file to appropriate folder based on extension."""
        try:
            file_path = Path(file_path)
            
            # Skip hidden files
            if file_path.name.startswith('.'):
                return
            
            # Get file extension
            extension = file_path.suffix.lower()
            
            # Determine category
            category = self._get_category(extension)
            
            if category:
                # Create folder structure: Category/YYYY-MM/
                date_folder = datetime.now().strftime('%Y-%m')
                dest_folder = self.watch_path / category / date_folder
                dest_folder.mkdir(parents=True, exist_ok=True)
                
                # Move file
                dest_path = dest_folder / file_path.name
                
                # Handle duplicate filenames
                counter = 1
                while dest_path.exists():
                    stem = file_path.stem
                    dest_path = dest_folder / f"{stem}_{counter}{extension}"
                    counter += 1
                
                shutil.move(str(file_path), str(dest_path))
                print(f"✓ Organized: {file_path.name} → {category}/{date_folder}")
        
        except Exception as e:
            print(f"✗ Error organizing {file_path}: {e}")
    
    def _get_category(self, extension):
        """Return category name for given file extension."""
        for category, extensions in self.file_categories.items():
            if extension in extensions:
                return category
        return 'Others'

def main():
    """Start the file organizer with CLI interface."""
    import sys
    
    # Get watch directory from command line or use current directory
    watch_directory = sys.argv[1] if len(sys.argv) > 1 else '.'
    watch_directory = os.path.abspath(watch_directory)
    
    print(f"🔍 Watching: {watch_directory}")
    print("Press Ctrl+C to stop...\\n")
    
    # Create organizer and observer
    organizer = FileOrganizer(watch_directory)
    observer = Observer()
    observer.schedule(organizer, watch_directory, recursive=False)
    
    # Start watching
    observer.start()
    
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
        print("\\n👋 Stopped monitoring")
    
    observer.join()

if __name__ == "__main__":
    main()`,
  language: 'python',
  title: 'File Organizer Script',
  description: 'Automatically organize files into folders by type and date',
  tags: ['python', 'automation', 'file-management', 'watchdog'],
};
