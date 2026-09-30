/* ============================================================
   DATA: this is the only file you need to edit.

   TEACHERS: name must be unique.
     photo = image URL, or '' for a colored initial.
     Local files (e.g. 'photos/dana.jpg') and data: URLs always work
     in the exported image. Remote URLs must allow cross-origin
     loading (CORS), otherwise the placeholder is used in the PNG.
   JOBS: title must be unique.
   ============================================================ */
const TEACHERS = [
  { name: 'רונית אלקיים',  photo: '' },
  { name: 'משה גולדברג',   photo: '' },
  { name: 'תמר בן־דוד',    photo: '' },
  { name: 'אבי כהן',       photo: '' },
  { name: 'דנה לוי',       photo: '' },
  { name: 'יוסי מזרחי',    photo: '' },
  { name: 'מיכל פרידמן',   photo: '' },
  { name: 'עומר שטרן',     photo: '' },
  { name: 'נועה אברהמי',   photo: '' },
  { name: 'אריאל דהן',     photo: '' },
  { name: 'שרון ביטון',    photo: '' },
  { name: 'רחל קפלן',      photo: '' },
  { name: 'גיל אשכנזי',    photo: '' },
  { name: 'ליאת חדד',      photo: '' },
];

const JOBS = [
  { title: 'מנהל בית הספר' },
  { title: 'גזברות' },
  { title: 'תרבות' },
  { title: 'ספורט' },
  { title: 'ביטחון' },
  { title: 'טקסים ואירועים' },
  { title: 'קפיטריה' },
  { title: 'יחסי ציבור' },
  { title: 'מחשוב' },
  { title: 'חדר המורים' },
];

const TITLE  = 'ממשלת בית הספר';  // headline on site and image
const FOOTER = 'בית הספר שלנו';    // small footer text on the image
