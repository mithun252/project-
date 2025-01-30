const fs = require('fs');
const path = require('path');
const https = require('https');

const imageUrls = {
  // Cars
  'car1.jpg': 'https://stimg.cardekho.com/images/carexteriorimages/930x620/Honda/City/9710/1677914238296/front-left-side-47.jpg',
  'car2.jpg': 'https://imgd.aeplcdn.com/1280x720/n/cw/ec/141115/creta-exterior-right-front-three-quarter.jpeg',
  'car3.jpg': 'https://imgd.aeplcdn.com/1280x720/n/cw/ec/141867/nexon-exterior-right-front-three-quarter-71.jpeg',
  
  // Motorcycles
  'bike1.jpg': 'https://imgd.aeplcdn.com/1280x720/n/cw/ec/141375/classic-350-right-front-three-quarter-8.jpeg',
  'bike2.jpg': 'https://bd.gaadicdn.com/processedimages/yamaha/yamaha-r15-v4/source/yamaha-r15-v4641e7fb2ab6a1.jpg',
  'bike3.jpg': 'https://bd.gaadicdn.com/processedimages/ktm/390-duke/source/390-duke62e0c10cb0608.jpg',
  
  // Mobile Phones
  'phone1.jpg': 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-14-pro-model-unselect-gallery-2-202209_GEO_EMEA?wid=2560&hei=1440&fmt=p-jpg&qlt=80&.v=1660753617539',
  'phone2.jpg': 'https://images.samsung.com/in/smartphones/galaxy-s23-ultra/images/galaxy-s23-ultra-highlights-kv.jpg',
  'phone3.jpg': 'https://oasis.opstatics.com/content/dam/oasis/page/2023/11-global/pro/specs/black.png',
  
  // Electronics
  'laptop1.jpg': 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/mbp-14-spacegray-select-202301?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1671304673229',
  'ps5.jpg': 'https://gmedia.playstation.com/is/image/SIEPDC/ps5-product-thumbnail-01-en-14sep21',
  'ipad.jpg': 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/ipad-pro-12-11-select-202210?wid=545&hei=550&fmt=jpeg&qlt=95&.v=1664411207154',
  
  // Furniture
  'sofa1.jpg': 'https://www.godrejinterio.com/imagestore/B2C/56101543SD00046/56101543SD00046_A1_803x602.png',
  'bed1.jpg': 'https://www.godrejinterio.com/imagestore/B2C/ADVENTQUEEN/ADVENTQUEEN_A1_803x602.png',
  'dining1.jpg': 'https://www.godrejinterio.com/imagestore/B2C/VIENNADINING6STR/VIENNADINING6STR_A1_803x602.png',
  
  // Fashion
  'lehenga1.jpg': 'https://assets.ajio.com/medias/sys_master/root/20230623/qwer/6494ec5842f9e729d785e6ab/-473Wx593H-466119151-maroon-MODEL.jpg',
  'suit1.jpg': 'https://www.raymond.in/cdn/shop/products/RPSM03997-B8_1_1800x1800.jpg',
  'shoes1.jpg': 'https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/99486859-0ff3-46b4-949b-2d16af2ad421/custom-nike-dunk-high-by-you-shoes.png',
  
  // Books
  'books1.jpg': 'https://m.media-amazon.com/images/I/71RvqDqysLL._AC_UY327_FMwebp_QL65_.jpg',
  'books2.jpg': 'https://m.media-amazon.com/images/I/91bYsX41DVL._AC_UY327_FMwebp_QL65_.jpg',
  'books3.jpg': 'https://m.media-amazon.com/images/I/71YT6yhEYsL._AC_UY327_FMwebp_QL65_.jpg',
  
  // Sports
  'cricket1.jpg': 'https://www.mrf.in/content/dam/mrf/consumer/cricket-bats/genius-le/banner.jpg',
  'gym1.jpg': 'https://5.imimg.com/data5/SELLER/Default/2021/12/MI/CM/OC/26602448/motorized-treadmill-500x500.jpg',
  'tennis1.jpg': 'https://www.wilson.com/en-us/media/catalog/product/W/R/WR074511U__8db86a6c5d2b3a7c4c7c32974c7e77c7.png',
  
  // Properties
  'property1.jpg': 'https://is1-3.housingcdn.com/4f2250e8/1365ed42a36e78aaae9250d023547c19/v0/medium/3_bhk_apartment-for-sale-kandivali_east-Mumbai-living_room.jpg',
  'property2.jpg': 'https://is1-3.housingcdn.com/4f2250e8/ac71822f736398d9c79c70464dd31997/v0/medium/shop-for-sale-bandra_west-Mumbai-others.jpg',
  'property3.jpg': 'https://is1-3.housingcdn.com/4f2250e8/4fc41a5d804b9763c5d7c5a7c4c5c8e2/v0/medium/4_bhk_villa-for-sale-bandra_west-Mumbai-building_view.jpg'
};

const downloadImage = (url, filename) => {
  return new Promise((resolve, reject) => {
    const filepath = path.join(__dirname, '../../uploads', filename);
    
    // Skip if file already exists
    if (fs.existsSync(filepath)) {
      console.log(`${filename} already exists, skipping...`);
      resolve();
      return;
    }

    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${filename}: ${response.statusCode}`));
        return;
      }

      const fileStream = fs.createWriteStream(filepath);
      response.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        console.log(`Downloaded ${filename}`);
        resolve();
      });

      fileStream.on('error', (err) => {
        fs.unlink(filepath, () => {}); // Delete the file if there was an error
        reject(err);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
};

const downloadAllImages = async () => {
  // Create uploads directory if it doesn't exist
  const uploadsDir = path.join(__dirname, '../../uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('Created uploads directory');
  }

  // Download all images
  for (const [filename, url] of Object.entries(imageUrls)) {
    try {
      await downloadImage(url, filename);
    } catch (error) {
      console.error(`Error downloading ${filename}:`, error.message);
      // Create a placeholder image if download fails
      const placeholderPath = path.join(uploadsDir, filename);
      if (!fs.existsSync(placeholderPath)) {
        const placeholderImage = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', 'base64');
        fs.writeFileSync(placeholderPath, placeholderImage);
        console.log(`Created placeholder image for ${filename}`);
      }
    }
  }

  console.log('All images processed');
};

downloadAllImages();
