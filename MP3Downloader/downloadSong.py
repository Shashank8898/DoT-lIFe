import tkinter as tk
from tkinter import messagebox, filedialog
import yt_dlp
import threading
import os


download_path = os.getcwd()  # default location


def select_folder():
    global download_path
    folder = filedialog.askdirectory()
    if folder:
        download_path = folder
        folder_label.config(text=f"Save to: {download_path}")


def clear_field():
    url_entry.delete(0, tk.END)
    status_label.config(text="")


def download_audio():
    url = url_entry.get().strip()

    if not url:
        messagebox.showerror("Error", "Please enter a YouTube URL")
        return

    status_label.config(text="Downloading...")
    download_button.config(state="disabled")

    def run_download():
        try:
            ydl_opts = {
                'format': 'bestaudio/best',
                'outtmpl': os.path.join(download_path, '%(title)s.%(ext)s'),
                'postprocessors': [{
                    'key': 'FFmpegExtractAudio',
                    'preferredcodec': 'mp3',
                    'preferredquality': '192',
                }],
            }

            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                ydl.download([url])

            root.after(0, download_success)

        except Exception as e:
            root.after(0, lambda: download_error(str(e)))

    threading.Thread(target=run_download, daemon=True).start()


def download_success():
    status_label.config(text="Download complete 🎧")
    download_button.config(state="normal")


def download_error(error_message):
    status_label.config(text="Error occurred ❌")
    download_button.config(state="normal")
    messagebox.showerror("Download Error", error_message)


# ---------------- GUI ----------------

root = tk.Tk()
root.title("YT to MP3 Downloader")
root.geometry("500x250")
root.resizable(False, False)

frame = tk.Frame(root, padx=20, pady=20)
frame.pack(fill="both", expand=True)

tk.Label(frame, text="YouTube URL:", font=("Arial", 11)).pack(anchor="w")

url_entry = tk.Entry(frame, width=65)
url_entry.pack(pady=8)

button_frame = tk.Frame(frame)
button_frame.pack(pady=5)

download_button = tk.Button(
    button_frame,
    text="Download MP3",
    width=15,
    command=download_audio
)
download_button.pack(side="left", padx=5)

clear_button = tk.Button(
    button_frame,
    text="Clear",
    width=10,
    command=clear_field
)
clear_button.pack(side="left", padx=5)

folder_button = tk.Button(
    frame,
    text="Select Download Folder",
    command=select_folder
)
folder_button.pack(pady=5)

folder_label = tk.Label(
    frame,
    text=f"Save to: {download_path}",
    wraplength=460,
    fg="blue"
)
folder_label.pack(pady=5)

status_label = tk.Label(frame, text="", fg="green")
status_label.pack(pady=5)

root.mainloop()
