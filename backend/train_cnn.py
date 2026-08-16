import tensorflow as tf
from keras.preprocessing.image import ImageDataGenerator
from keras.applications import MobileNetV2
from keras.layers import Dense, GlobalAveragePooling2D, Dropout
from keras.models import Model
from keras.optimizers import Adam
import os
import zipfile
import kagglehub

# Set Kaggle cache to a much shorter path to fix Windows Long Path error
os.environ["KAGGLEHUB_CACHE"] = "C:\\K"

# Automatically download dataset from Kaggle
print("Downloading Kaggle dataset...")
path = kagglehub.dataset_download("ahmednasser83/tomato-leaf-disease-dataset")
print(f"Path to dataset files: {path}")

# Configuration - adjust to the kagglehub path
# For the tomato dataset, the train folder is likely inside this path directly or under a specific folder.
# We will use the root path of the downloaded dataset for both training and validation by using validation_split
DATA_DIR = path
IMG_SIZE = (224, 224)
BATCH_SIZE = 32
EPOCHS = 15

def build_model(num_classes):
    # Use MobileNetV2 for mobile-friendly efficiency and high accuracy on ESP32 images
    base_model = MobileNetV2(weights='imagenet', include_top=False, input_shape=(224, 224, 3))
    
    # Freeze the base model
    base_model.trainable = False

    x = base_model.output
    x = GlobalAveragePooling2D()(x)
    x = Dense(128, activation='relu')(x)
    x = Dropout(0.5)(x)
    predictions = Dense(num_classes, activation='softmax')(x)

    model = Model(inputs=base_model.input, outputs=predictions)
    
    model.compile(optimizer='adam', 
                  loss='categorical_crossentropy', 
                  metrics=['accuracy'])
    return model

def train():
    if not os.path.exists(DATA_DIR):
        print(f"Please ensure Kaggle dataset is at '{DATA_DIR}'.")
        return

    # Data Augmentation (Critical for ESP32 and phone camera variances)
    # The tomato dataset typically has a single folder with subfolders for each class
    datagen = ImageDataGenerator(
        rescale=1./255,
        rotation_range=20,
        width_shift_range=0.2,
        height_shift_range=0.2,
        horizontal_flip=True,
        validation_split=0.2 # 80% train, 20% val
    )

    # Use the root dataset directory
    train_generator = datagen.flow_from_directory(
        DATA_DIR,
        target_size=IMG_SIZE,
        batch_size=BATCH_SIZE,
        class_mode='categorical',
        subset='training'
    )

    val_generator = datagen.flow_from_directory(
        DATA_DIR,
        target_size=IMG_SIZE,
        batch_size=BATCH_SIZE,
        class_mode='categorical',
        subset='validation'
    )

    num_classes = len(train_generator.class_indices)
    model = build_model(num_classes)
    
    print(f"Starting training for {num_classes} tomato classes...")
    history = model.fit(
        train_generator,
        epochs=EPOCHS,
        validation_data=val_generator
    )

    # Save the final model
    model.save('plant_disease_model.h5')
    print("Model saved to plant_disease_model.h5")

    # Save class indices
    import json
    with open('class_indices.json', 'w') as f:
        json.dump(train_generator.class_indices, f)

if __name__ == '__main__':
    train()