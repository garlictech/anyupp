import axios from 'axios';
import FormData from 'form-data';
import * as fs from 'fs';

import { ReportDeps } from './interfaces';

export const uploadReport = (deps: ReportDeps) => () => {
  const bodyFormData = new FormData();

  bodyFormData.append('token', deps.slackBotToken);
  bodyFormData.append('title', `Weekly report (${deps.reportDate})`);
  bodyFormData.append('filename', deps.reportFile.split('/').pop() || '');
  bodyFormData.append('filetype', 'auto');
  bodyFormData.append('channels', deps.slackChannel);
  bodyFormData.append('file', fs.createReadStream(deps.reportFile));

  return axios({
    method: 'post',
    url: 'https://slack.com/api/files.upload',
    data: bodyFormData,
    headers: bodyFormData.getHeaders(),
  });
};

// Use fileId from the uploadReport() -> response.body.file.id
export const deleteReport = (deps: ReportDeps) => async (fileId: string) => {
  const bodyFormData = new FormData();

  bodyFormData.append('token', deps.slackBotToken);
  bodyFormData.append('file', fileId);

  return axios({
    method: 'post',
    url: 'https://slack.com/api/files.delete',
    data: bodyFormData,
    headers: bodyFormData.getHeaders(),
  });
};
