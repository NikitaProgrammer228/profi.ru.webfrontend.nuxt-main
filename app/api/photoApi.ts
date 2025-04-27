import { api } from ".";

interface Image {
    id: string;
    name: string;
    image: string;
}

interface UploadedImage {
    id: string;
    url: string;
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

export const uploadImage = async (formData: FormData): Promise<UploadedImage> => {
    const response = await api.post('/api/v1/image/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

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
