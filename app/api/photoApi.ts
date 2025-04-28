import { api } from ".";

interface Image {
    id: string;
    name: string;
    image: string;
}

interface UploadedImage {
    id: string;
    image: string;
}

// /image:
// get:
//   operationId: image_list
export async function getImages(): Promise<Image[]> {
    const res = await api.get("/api/v1/image");

    return res.data;
}

// /image/{id}:
// get:
//   operationId: image_read
export async function getImage(id: string): Promise<Image> {
    const res = await api.get(`/api/v1/image/${id}`);

    return res.data;
}

export async function postImage(data: FormData): Promise<Image> {
    const res = await api.post(`/api/v1/image`, data, { headers: { "Content-Type": "multipart/form-data" } });

    return res.data;
}

/**
 * Upload a File object as multipart/form-data to the image upload endpoint.
 * @param file The image File to upload under the 'image' key.
 * @returns The uploaded image metadata, containing `id` and `image` URL.
 */
export async function uploadImage(file: File): Promise<UploadedImage> {
    const formData = new FormData();
    formData.append('image', file);
    // use api.request to send multipart/form-data without JSON serialization
    const response = await api.request<UploadedImage>({
        url: '/api/v1/image/upload',
        method: 'POST',
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        // Prevent axios from serializing FormData to JSON
        transformRequest: [(data) => data]
    });
    return response.data;
}

// post:
//   operationId: image_create

// /image/upload:
// post:
//   operationId: image_upload_image

// /image/{id}:

// put:
//   operationId: image_update

// patch:
//   operationId: image_partial_update

// delete:
//   operationId: image_delete
