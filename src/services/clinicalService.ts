export async function fetchClinicalData(patientId: string, tabId: string) {
  console.log('fetchClinicalData service', patientId, tabId);
  return Promise.resolve();
}

export async function saveClinicalData(patientId: string, tabId: string, data: unknown) {
  console.log('saveClinicalData service', patientId, tabId, data);
  return Promise.resolve();
}
