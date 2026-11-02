🌿 AI-Powered Smart Plant Disease Monitoring System Using Computer Vision and IoT

An ESP32-CAM watches over the farm, a deep learning model spots diseased plants, and the farmer gets an alert on their phone.

📌 Project Overview

This project is a smart agriculture system that detects plant diseases from leaf images using computer vision and a trained Convolutional Neural Network (CNN). It works in two ways:

In the field: An ESP32-CAM module installed in the farm continuously captures images of the crops. Each image is analysed by the AI model, and if a diseased plant is detected, the farmer instantly receives a push notification on their phone.
In the farmer's hand: The mobile app lets the user scan a leaf live with the phone camera or upload an image from the gallery to get an instant diagnosis.

For every detection, the app shows the predicted disease, information about the plant, and recommended treatment and preventive measures. By catching infections early, the system helps farmers act before a disease spreads and reduces crop losses.

✨ Key Features
Feature	Description
📡 Live Farm Monitoring	An ESP32-CAM placed in the field captures crop images automatically, so plants are monitored even when no one is around.
🔔 Instant Disease Alerts	The app sends a push notification to the farmer's phone the moment a diseased plant is detected in the field.
📷 Phone Camera Scanning	Users can point their phone camera at a leaf and get a diagnosis on the spot.
🖼️ Upload from Gallery	Users can pick an existing leaf photo from their phone's media and analyse it.
🤖 CNN-Based Classification	A deep learning model trained with TensorFlow/Keras classifies the leaf into its disease class.
💊 Treatment Recommendations	Each result comes with possible remedies and preventive steps for the detected disease.
🔥 Firebase Backend	Firebase handles data storage, detection history and notification delivery.
🏗️ System Architecture
Captures leaf images
Sends image
Prediction result
Push notification
Result, plant info &treatment
ESP32-CAM in Farm
AI Model ServerCNN - TensorFlow/Keras
Mobile AppCamera Scan / GalleryUpload
Firebase
Farmer's Phone
⚙️ How It Works

Automatic field monitoring

The ESP32-CAM, installed in the farm, captures images of the plants at regular intervals.
Each image is sent to the model server, where it is resized and preprocessed for the CNN.
The model predicts whether the plant is healthy or which disease it has.
If a disease is detected, the result is stored in Firebase and a push notification is sent to the farmer's phone.
The farmer opens the app to see the disease name, plant details and recommended treatment.

Manual scanning from the app

The user opens the app and either scans a leaf with the phone camera or uploads a photo from the gallery.
The image is sent to the model for analysis.
The app displays the predicted disease along with treatment and prevention advice.
🛠️ Tech Stack
Layer	Technology
Computer Vision / Deep Learning	Python, TensorFlow / Keras, CNN
Mobile App	React Native, Expo
Backend & Notifications	Firebase
IoT Hardware	ESP32-CAM
Version Control	Git, GitHub
🚀 Getting Started
Prerequisites
Python 3.x
Node.js and npm
An Expo-compatible phone (Expo Go) or an Android/iOS emulator
A Firebase project
ESP32-CAM module with a USB-to-TTL programmer (for field monitoring)
Arduino IDE with ESP32 board support (to flash the ESP32-CAM)
1. Clone the repository
bash
git clone https://github.com/Adityaskumbar/smart-plant-disease-monitoring.git
cd smart-plant-disease-monitoring
2. Set up the mobile app

Navigate to the folder that contains package.json and run:

bash
npm install
npx expo start

Scan the QR code with Expo Go, or press a / i to open it in an emulator.

3. Set up the AI model

Place plant_disease_model.h5 and class_indices.json in the location expected by the model-loading code, then install the Python dependencies:

bash
pip install -r requirements.txt
4. Configure Firebase

Create a Firebase project, enable the services the app uses (database and Cloud Messaging for notifications), and add your Firebase configuration to the app.

5. Set up the ESP32-CAM
Open the ESP32-CAM sketch in Arduino IDE.
Enter your Wi-Fi credentials and the model server endpoint in the sketch.
Select the AI Thinker ESP32-CAM board and flash the code.
Mount the module in the farm facing the crops, with a stable power supply and Wi-Fi coverage.
📂 Important Project Files
File	Purpose
plant_disease_model.h5	Trained CNN model for plant disease classification
class_indices.json	Maps model output indices to disease class names
create_db.py	Sets up the database used by the application
package.json	Mobile app dependencies and scripts
🎯 Applications
Continuous, unattended disease monitoring in farms and greenhouses
Early warning for farmers before infections spread across the field
Quick leaf diagnosis for home gardeners and nursery owners
Smart agriculture and IoT-based crop health systems
Educational projects combining AI, IoT and agriculture
🔮 Future Enhancements
Support for more crop species and disease classes
On-device inference on the ESP32 using TensorFlow Lite Micro, so detection works without internet
Solar-powered ESP32-CAM units for remote fields
Multiple cameras with a farm map showing where each disease was detected
Weather-based disease risk prediction
Multilingual support, including Kannada and Hindi, for farmers
Integration with soil moisture, temperature and humidity sensors
⚠️ Disclaimer

This system provides AI-generated predictions and general treatment suggestions. Results can be affected by image quality, lighting, camera angle and the limits of the training dataset. For serious crop health problems, please confirm the diagnosis with an agricultural expert before applying any treatment.

👨‍💻 Repository

GitHub: github.com/Adityaskumbar/smart-plant-disease-monitoring

📄 License

No license has been added yet. Adding one (such as MIT) will define how others can use, modify and share this project.
