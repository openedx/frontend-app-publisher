import DiscoveryDataApiService from '../../data/services/DiscoveryDataApiService';

export default (owners) => (value) => {
  const organizationKeys = owners.map(owner => owner.key);
  return DiscoveryDataApiService
    .autocompletePerson(value, organizationKeys);
};
