const fs = require('fs');
const path = require('path');

const createUploadsDirectory = () => {
  const uploadsDir = path.join(__dirname, '../../uploads');
  
  // Create uploads directory if it doesn't exist
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('Created uploads directory');
  }

  // Create sample images
  const sampleImages = [
    'car1.jpg', 'car2.jpg', 'car3.jpg',
    'bike1.jpg', 'bike2.jpg', 'bike3.jpg',
    'phone1.jpg', 'phone2.jpg', 'phone3.jpg',
    'laptop1.jpg', 'ps5.jpg', 'ipad.jpg',
    'sofa1.jpg', 'bed1.jpg', 'dining1.jpg',
    'lehenga1.jpg', 'suit1.jpg', 'shoes1.jpg',
    'books1.jpg', 'books2.jpg', 'books3.jpg',
    'cricket1.jpg', 'gym1.jpg', 'tennis1.jpg',
    'property1.jpg', 'property2.jpg', 'property3.jpg'
  ];

  sampleImages.forEach(image => {
    const imagePath = path.join(uploadsDir, image);
    if (!fs.existsSync(imagePath)) {
      // Create a simple placeholder image (1x1 pixel transparent PNG)
      const placeholderImage = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', 'base64');
      fs.writeFileSync(imagePath, placeholderImage);
      console.log(`Created placeholder image: ${image}`);
    }
  });

  console.log('Sample images are ready');
};

createUploadsDirectory();
