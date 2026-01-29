"""
CNN Model Training Script for Image Forgery Detection
======================================================

This script trains a CNN model on ELA-processed images from
CASIA v1.0/v2.0 and Columbia Image Splicing datasets.

Usage:
    python train_model.py --data_dir ./data --epochs 50 --batch_size 32
"""

import os
import argparse
import json
import numpy as np
from datetime import datetime

# TensorFlow/Keras imports
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers, Model
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.callbacks import ModelCheckpoint, EarlyStopping, ReduceLROnPlateau
from sklearn.metrics import confusion_matrix, classification_report
import matplotlib.pyplot as plt


def create_cnn_model(input_shape=(128, 128, 3)):
    """
    Create CNN architecture for binary classification.
    
    Architecture:
    - 4 Convolutional blocks with BatchNorm and MaxPooling
    - Dense layers with Dropout for regularization
    - Sigmoid output for binary classification
    """
    inputs = keras.Input(shape=input_shape)
    
    # Block 1
    x = layers.Conv2D(32, (3, 3), padding='same')(inputs)
    x = layers.BatchNormalization()(x)
    x = layers.Activation('relu')(x)
    x = layers.Conv2D(32, (3, 3), padding='same')(x)
    x = layers.BatchNormalization()(x)
    x = layers.Activation('relu')(x)
    x = layers.MaxPooling2D((2, 2))(x)
    x = layers.Dropout(0.25)(x)
    
    # Block 2
    x = layers.Conv2D(64, (3, 3), padding='same')(x)
    x = layers.BatchNormalization()(x)
    x = layers.Activation('relu')(x)
    x = layers.Conv2D(64, (3, 3), padding='same')(x)
    x = layers.BatchNormalization()(x)
    x = layers.Activation('relu')(x)
    x = layers.MaxPooling2D((2, 2))(x)
    x = layers.Dropout(0.25)(x)
    
    # Block 3
    x = layers.Conv2D(128, (3, 3), padding='same')(x)
    x = layers.BatchNormalization()(x)
    x = layers.Activation('relu')(x)
    x = layers.Conv2D(128, (3, 3), padding='same')(x)
    x = layers.BatchNormalization()(x)
    x = layers.Activation('relu')(x)
    x = layers.MaxPooling2D((2, 2))(x)
    x = layers.Dropout(0.25)(x)
    
    # Block 4
    x = layers.Conv2D(256, (3, 3), padding='same')(x)
    x = layers.BatchNormalization()(x)
    x = layers.Activation('relu')(x)
    x = layers.Conv2D(256, (3, 3), padding='same')(x)
    x = layers.BatchNormalization()(x)
    x = layers.Activation('relu')(x)
    x = layers.MaxPooling2D((2, 2))(x)
    x = layers.Dropout(0.25)(x)
    
    # Dense layers
    x = layers.Flatten()(x)
    x = layers.Dense(512)(x)
    x = layers.BatchNormalization()(x)
    x = layers.Activation('relu')(x)
    x = layers.Dropout(0.5)(x)
    
    x = layers.Dense(256)(x)
    x = layers.BatchNormalization()(x)
    x = layers.Activation('relu')(x)
    x = layers.Dropout(0.5)(x)
    
    # Output
    outputs = layers.Dense(1, activation='sigmoid')(x)
    
    model = Model(inputs, outputs, name='ForgeryDetectionCNN')
    return model


def prepare_data_generators(data_dir, img_size=(128, 128), batch_size=32, validation_split=0.2):
    """
    Create data generators for training and validation.
    
    Expected directory structure:
    data_dir/
        authentic/
            image1.png
            image2.png
            ...
        forged/
            image1.png
            image2.png
            ...
    """
    train_datagen = ImageDataGenerator(
        rescale=1./255,
        rotation_range=20,
        width_shift_range=0.2,
        height_shift_range=0.2,
        shear_range=0.2,
        zoom_range=0.2,
        horizontal_flip=True,
        validation_split=validation_split
    )
    
    train_generator = train_datagen.flow_from_directory(
        data_dir,
        target_size=img_size,
        batch_size=batch_size,
        class_mode='binary',
        subset='training',
        shuffle=True
    )
    
    val_generator = train_datagen.flow_from_directory(
        data_dir,
        target_size=img_size,
        batch_size=batch_size,
        class_mode='binary',
        subset='validation',
        shuffle=False
    )
    
    return train_generator, val_generator


def train_model(data_dir, epochs=50, batch_size=32, output_dir='./models'):
    """
    Train the CNN model and save results.
    """
    print("=" * 60)
    print("Image Forgery Detection - CNN Training")
    print("=" * 60)
    
    # Create output directory
    os.makedirs(output_dir, exist_ok=True)
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    
    # Prepare data
    print("\n[1/5] Loading data...")
    train_gen, val_gen = prepare_data_generators(
        data_dir, 
        batch_size=batch_size
    )
    print(f"  Training samples: {train_gen.samples}")
    print(f"  Validation samples: {val_gen.samples}")
    print(f"  Classes: {train_gen.class_indices}")
    
    # Build model
    print("\n[2/5] Building model...")
    model = create_cnn_model()
    model.compile(
        optimizer=keras.optimizers.Adam(learning_rate=0.001),
        loss='binary_crossentropy',
        metrics=['accuracy']
    )
    model.summary()
    
    # Callbacks
    callbacks = [
        ModelCheckpoint(
            os.path.join(output_dir, f'best_model_{timestamp}.h5'),
            monitor='val_accuracy',
            save_best_only=True,
            verbose=1
        ),
        EarlyStopping(
            monitor='val_loss',
            patience=10,
            restore_best_weights=True,
            verbose=1
        ),
        ReduceLROnPlateau(
            monitor='val_loss',
            factor=0.5,
            patience=5,
            min_lr=1e-7,
            verbose=1
        )
    ]
    
    # Train
    print("\n[3/5] Training model...")
    history = model.fit(
        train_gen,
        epochs=epochs,
        validation_data=val_gen,
        callbacks=callbacks,
        verbose=1
    )
    
    # Evaluate
    print("\n[4/5] Evaluating model...")
    val_gen.reset()
    predictions = model.predict(val_gen, verbose=1)
    y_pred = (predictions > 0.5).astype(int).flatten()
    y_true = val_gen.classes
    
    # Confusion matrix
    cm = confusion_matrix(y_true, y_pred)
    tn, fp, fn, tp = cm.ravel()
    
    print("\nClassification Report:")
    print(classification_report(y_true, y_pred, target_names=['Authentic', 'Forged']))
    
    # Save metrics
    print("\n[5/5] Saving results...")
    
    metrics = {
        'final_accuracy': float(history.history['val_accuracy'][-1]),
        'final_loss': float(history.history['val_loss'][-1]),
        'precision': float(tp / (tp + fp)) if (tp + fp) > 0 else 0,
        'recall': float(tp / (tp + fn)) if (tp + fn) > 0 else 0,
        'f1_score': 0,  # Calculated below
        'total_epochs': len(history.history['accuracy']),
        'training_history': [
            {
                'epoch': i + 1,
                'train_accuracy': float(history.history['accuracy'][i]),
                'val_accuracy': float(history.history['val_accuracy'][i]),
                'train_loss': float(history.history['loss'][i]),
                'val_loss': float(history.history['val_loss'][i])
            }
            for i in range(len(history.history['accuracy']))
        ],
        'confusion_matrix': {
            'true_positive': int(tp),
            'false_positive': int(fp),
            'true_negative': int(tn),
            'false_negative': int(fn)
        }
    }
    
    # Calculate F1 score
    if metrics['precision'] + metrics['recall'] > 0:
        metrics['f1_score'] = 2 * (metrics['precision'] * metrics['recall']) / (metrics['precision'] + metrics['recall'])
    
    # Save metrics JSON
    metrics_path = os.path.join(output_dir, f'metrics_{timestamp}.json')
    with open(metrics_path, 'w') as f:
        json.dump(metrics, f, indent=2)
    print(f"  Metrics saved to: {metrics_path}")
    
    # Save model
    model_path = os.path.join(output_dir, f'forgery_cnn_{timestamp}.h5')
    model.save(model_path)
    print(f"  Model saved to: {model_path}")
    
    # Plot training history
    plot_training_history(history, output_dir, timestamp)
    
    print("\n" + "=" * 60)
    print("Training Complete!")
    print(f"  Final Accuracy: {metrics['final_accuracy']:.4f}")
    print(f"  Final Loss: {metrics['final_loss']:.4f}")
    print(f"  F1 Score: {metrics['f1_score']:.4f}")
    print("=" * 60)
    
    return model, metrics


def plot_training_history(history, output_dir, timestamp):
    """Generate and save training plots."""
    fig, axes = plt.subplots(1, 2, figsize=(14, 5))
    
    # Accuracy plot
    axes[0].plot(history.history['accuracy'], label='Training')
    axes[0].plot(history.history['val_accuracy'], label='Validation')
    axes[0].set_title('Model Accuracy')
    axes[0].set_xlabel('Epoch')
    axes[0].set_ylabel('Accuracy')
    axes[0].legend()
    axes[0].grid(True, alpha=0.3)
    
    # Loss plot
    axes[1].plot(history.history['loss'], label='Training')
    axes[1].plot(history.history['val_loss'], label='Validation')
    axes[1].set_title('Model Loss')
    axes[1].set_xlabel('Epoch')
    axes[1].set_ylabel('Loss')
    axes[1].legend()
    axes[1].grid(True, alpha=0.3)
    
    plt.tight_layout()
    plot_path = os.path.join(output_dir, f'training_history_{timestamp}.png')
    plt.savefig(plot_path, dpi=150)
    plt.close()
    print(f"  Training plots saved to: {plot_path}")


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Train CNN for Image Forgery Detection')
    parser.add_argument('--data_dir', type=str, required=True, help='Path to ELA-processed dataset')
    parser.add_argument('--epochs', type=int, default=50, help='Number of training epochs')
    parser.add_argument('--batch_size', type=int, default=32, help='Batch size')
    parser.add_argument('--output_dir', type=str, default='./models', help='Output directory for models and metrics')
    
    args = parser.parse_args()
    
    train_model(
        data_dir=args.data_dir,
        epochs=args.epochs,
        batch_size=args.batch_size,
        output_dir=args.output_dir
    )
