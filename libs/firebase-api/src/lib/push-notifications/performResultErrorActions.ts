import fbAdmin from 'firebase-admin';

export const performResultErrorActions = (params: {
  errorResult: fbAdmin.messaging.MessagingDeviceResult;
  fcmToken: string;
}) => {
  const { fcmToken, errorResult } = params;
  // TODO check errors and remove invalid tokens from DB
  // console.error('Error.code', errorResult.error?.code);
  // console.error('Error.message', errorResult.error?.message)
  console.error(
    'Error in performResultErrorActions',
    fcmToken,
    errorResult.error?.code,
    errorResult.error,
  );
};
