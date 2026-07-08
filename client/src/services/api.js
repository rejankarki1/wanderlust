const parseJson = async (response) => {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || data.message || "Request failed");
  }

  return data;
};

export const apiFetch = async (path, options = {}) => {
  const response = await fetch(path, {
    credentials: "include",
    ...options,
    headers: {
      ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...(options.headers || {}),
    },
  });

  return parseJson(response);
};

export const toListingFormData = (listing, imageFile) => {
  const formData = new FormData();

  for (const [key, value] of Object.entries(listing)) {
    formData.append(`listing[${key}]`, value);
  }

  if (imageFile) {
    formData.append("listing[image]", imageFile);
  }

  return formData;
};
