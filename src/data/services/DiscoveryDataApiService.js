import apiClient from '../apiClient';

class DiscoveryDataApiService {
  static discoveryBaseUrl = `${process.env.DISCOVERY_API_BASE_URL}/api/v1`;

  static fetchCourse(uuid) {
    const url = `${DiscoveryDataApiService.discoveryBaseUrl}/courses/${uuid}/`;
    return apiClient.get(url);
  }
}

export default DiscoveryDataApiService;
