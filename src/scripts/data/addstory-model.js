import CONFIG from "../config";

const AddStoryModel = {
  async uploadStory(formData, token) {
    const response = await fetch(`${CONFIG.BASE_URL}/stories`, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message);
    }

    return { success: true, ...result };
  },
};

export default AddStoryModel;
