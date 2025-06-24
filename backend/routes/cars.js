const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Car = require('../models/Car');

// Настройка multer для загрузки файлов
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = file.fieldname === 'photos' ? 'uploads/photos' : 'uploads/videos';
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'photos') {
    // Разрешаем только изображения
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Только изображения разрешены для поля photos'), false);
    }
  } else if (file.fieldname === 'videos') {
    // Разрешаем только видео
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Только видео файлы разрешены для поля videos'), false);
    }
  } else {
    cb(null, false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB лимит
  }
});

// Get car information by brand, model, and generation
router.get('/:brand/:model/:generation', async (req, res) => {
  try {
    const { brand, model, generation } = req.params;
    const car = await Car.findOne({
      where: {
        brand,
        model,
        generation: parseInt(generation)
      }
    });

    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    res.json(car);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create new car entry with media
router.post('/', upload.fields([
  { name: 'photos', maxCount: 10 },
  { name: 'videos', maxCount: 5 }
]), async (req, res) => {
  try {
    const carData = {
      brand: req.body.brand,
      model: req.body.model,
      generation: parseInt(req.body.generation),
      description: req.body.description,
      frames: req.body.frames,
      emulators: req.body.emulators,
      photos: [],
      videos: []
    };

    // Обрабатываем загруженные файлы
    if (req.files) {
      if (req.files.photos) {
        carData.photos = req.files.photos.map(file => ({
          filename: file.filename,
          originalname: file.originalname,
          path: file.path,
          size: file.size
        }));
      }
      
      if (req.files.videos) {
        carData.videos = req.files.videos.map(file => ({
          filename: file.filename,
          originalname: file.originalname,
          path: file.path,
          size: file.size
        }));
      }
    }

    const car = await Car.create(carData);
    res.status(201).json(car);
  } catch (error) {
    res.status(400).json({ message: 'Error creating car', error: error.message });
  }
});

// Update car information with media
router.put('/:brand/:model/:generation', upload.fields([
  { name: 'photos', maxCount: 10 },
  { name: 'videos', maxCount: 5 }
]), async (req, res) => {
  try {
    const { brand, model, generation } = req.params;
    
    const car = await Car.findOne({
      where: {
        brand,
        model,
        generation: parseInt(generation)
      }
    });

    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    const updateData = {
      description: req.body.description,
      frames: req.body.frames,
      emulators: req.body.emulators
    };

    // Обрабатываем загруженные файлы
    if (req.files) {
      const currentPhotos = car.photos || [];
      const currentVideos = car.videos || [];
      
      if (req.files.photos) {
        const newPhotos = req.files.photos.map(file => ({
          filename: file.filename,
          originalname: file.originalname,
          path: file.path,
          size: file.size
        }));
        updateData.photos = [...currentPhotos, ...newPhotos];
      }
      
      if (req.files.videos) {
        const newVideos = req.files.videos.map(file => ({
          filename: file.filename,
          originalname: file.originalname,
          path: file.path,
          size: file.size
        }));
        updateData.videos = [...currentVideos, ...newVideos];
      }
    }

    await Car.update(updateData, {
      where: {
        brand,
        model,
        generation: parseInt(generation)
      }
    });

    const updatedCar = await Car.findOne({
      where: {
        brand,
        model,
        generation: parseInt(generation)
      }
    });

    res.json(updatedCar);
  } catch (error) {
    res.status(400).json({ message: 'Error updating car', error: error.message });
  }
});

// Legacy routes for backward compatibility
router.post('/legacy', async (req, res) => {
  try {
    const car = await Car.create(req.body);
    res.status(201).json(car);
  } catch (error) {
    res.status(400).json({ message: 'Error creating car', error: error.message });
  }
});

router.put('/legacy/:brand/:model/:generation', async (req, res) => {
  try {
    const { brand, model, generation } = req.params;
    const [updated] = await Car.update(req.body, {
      where: {
        brand,
        model,
        generation: parseInt(generation)
      }
    });

    if (!updated) {
      return res.status(404).json({ message: 'Car not found' });
    }

    const updatedCar = await Car.findOne({
      where: {
        brand,
        model,
        generation: parseInt(generation)
      }
    });

    res.json(updatedCar);
  } catch (error) {
    res.status(400).json({ message: 'Error updating car', error: error.message });
  }
});

// Upload media files (legacy route)
router.post('/:brand/:model/:generation/media', upload.fields([
  { name: 'photos', maxCount: 10 },
  { name: 'videos', maxCount: 5 }
]), async (req, res) => {
  try {
    const { brand, model, generation } = req.params;
    
    const car = await Car.findOne({
      where: {
        brand,
        model,
        generation: parseInt(generation)
      }
    });

    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    const uploadedFiles = {
      photos: [],
      videos: []
    };

    if (req.files) {
      if (req.files.photos) {
        uploadedFiles.photos = req.files.photos.map(file => ({
          filename: file.filename,
          originalname: file.originalname,
          path: file.path,
          size: file.size
        }));
      }
      
      if (req.files.videos) {
        uploadedFiles.videos = req.files.videos.map(file => ({
          filename: file.filename,
          originalname: file.originalname,
          path: file.path,
          size: file.size
        }));
      }
    }

    // Обновляем существующие медиа файлы
    const currentPhotos = car.photos || [];
    const currentVideos = car.videos || [];
    
    const updatedPhotos = [...currentPhotos, ...uploadedFiles.photos];
    const updatedVideos = [...currentVideos, ...uploadedFiles.videos];

    await Car.update({
      photos: updatedPhotos,
      videos: updatedVideos
    }, {
      where: {
        brand,
        model,
        generation: parseInt(generation)
      }
    });

    const updatedCar = await Car.findOne({
      where: {
        brand,
        model,
        generation: parseInt(generation)
      }
    });

    res.json(updatedCar);
  } catch (error) {
    res.status(400).json({ message: 'Error uploading media', error: error.message });
  }
});

// Delete media file
router.delete('/:brand/:model/:generation/media/:type/:filename', async (req, res) => {
  try {
    const { brand, model, generation, type, filename } = req.params;
    
    const car = await Car.findOne({
      where: {
        brand,
        model,
        generation: parseInt(generation)
      }
    });

    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    const currentMedia = car[type] || [];
    const fileToDelete = currentMedia.find(file => file.filename === filename);
    
    if (!fileToDelete) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Удаляем файл с диска
    const filePath = fileToDelete.path;
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Обновляем запись в БД
    const updatedMedia = currentMedia.filter(file => file.filename !== filename);
    
    await Car.update({
      [type]: updatedMedia
    }, {
      where: {
        brand,
        model,
        generation: parseInt(generation)
      }
    });

    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting file', error: error.message });
  }
});

// Serve static files
router.use('/uploads', express.static('uploads'));

module.exports = router; 