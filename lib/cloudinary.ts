export async function uploadToCloudinary(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'BillSpliter_upload');
  const res = await fetch('https://api.cloudinary.com/v1_1/dr1xbanc3/image/upload', {
    method: 'POST',
    body: formData,
  });
  const data = await res.json();
  return data.secure_url;
}
