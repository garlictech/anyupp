import { IFCMMessageSendResult } from './IFCMMessageSendResult';
import { performResultErrorActions } from './performResultErrorActions';
import { MessagingDevicesResponse } from 'firebase-admin/messaging';

interface Params {
  fcmToken: string;
  mdResponse: MessagingDevicesResponse;
}

/**
 * Handles the aftermath of Push Notification sending
 * Should perform logging, error-handling, cleanup, etc..
 *
 * @param params
 */
export const handleMessageResponse = async (
  params: Params,
): Promise<IFCMMessageSendResult> => {
  const { fcmToken, mdResponse } = params;
  const { successCount, failureCount } = mdResponse;

  if (failureCount > 0) {
    console.debug('mdResponse', mdResponse);
    console.debug('fcmToken', fcmToken);

    await Promise.all(
      mdResponse.results
        .filter(result => result.error)
        .map(errorResult =>
          performResultErrorActions({
            fcmToken,
            errorResult,
          }),
        ),
    );
  }

  return {
    successCount,
    failureCount,
  };
};
