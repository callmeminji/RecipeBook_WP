// 필요한 모듈 불러오기
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 업로드 폴더 경로 설정
const uploadDir = path.join(__dirname, '..', 'public', 'uploads');


// uploads 폴더가 없으면 새로 생성
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir); // 폴더 생성
}

// multer 저장 방식 설정
const storage = multer.diskStorage({
  // 저장 위치 설정
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  // 저장될 파일 이름 설정
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname); // 확장자 추출 (.jpg 등)
    const base = path.basename(file.originalname, ext); // 확장자 제외한 파일명

    // 파일명 안전하게 변환 (공백 → _, 특수문자 제거, 소문자 변환)
    const safeName = base
      .replace(/\s+/g, '_')        // 공백 → 언더바
      .replace(/[^\w\-]/gi, '')    // 특수문자 및 한글 제거
      .toLowerCase();              // 모두 소문자로

    // 최종 파일명 예시: 1697058767321-myimage.jpg
    cb(null, `${Date.now()}-${safeName}${ext}`);
  }
});

// 업로드 가능한 파일 유형 제한 (이미지 파일만)
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // 통과
  } else {
    cb(new Error('Only image files are allowed.'), false); // 거절
  }
};

// multer 설정 적용
const upload = multer({
  storage,            // 저장 방식 지정
  fileFilter,         // 파일 타입 필터링
  limits: { files: 1 } // 최대 파일 개수 1개
});

// 외부에서 사용할 수 있도록 모듈 export
module.exports = upload;
