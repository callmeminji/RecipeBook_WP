const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 업로드 경로 설정
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir); // 폴더가 없으면 생성
}

// multer 저장 방식 설정
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.fieldname}${ext}`);
  }
});

// 이미지 파일만 허용
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed.'), false);
  }
};

// multer 인스턴스 생성
const upload = multer({
  storage,
  fileFilter,
  limits: { files: 1 }, // 1장만 허용
});

module.exports = upload; 
