import {getAssessmentIds} from './assessment'
import {getActivityLogCount, getActivityLogs} from './candidate'

const getCandidateActivityLogService = async ({
  index,
  userId,
  amount,
}: {
  index: number
  amount: number
  userId: string
}) => {
  if (!index) {
    throw Error('missing index')
  } else if (!amount) {
    throw Error('missing amount')
  } else if (!userId) {
    throw Error('missing userId')
  }
  try {
    const assessmentIds = await getAssessmentIds({userId})
    const activityLogCount = await getActivityLogCount({assessmentIds})
    const activityLogs = await getActivityLogs({
      assessmentIds,
      amount,
      skip: index,
    })
    return {activityLogCount, activityLogs}
  } catch (error) {}
}

export default getCandidateActivityLogService
