import ajax from '@/utils/request';
import config, { AppId } from '@/utils/config';
import { changeAuditForQA, removeQAById } from '@/services/Q&A/q_a';

const { reqNews } = config;

const commentTypeIdConfig = {
  ask: 1, // 提问
  reply: 2, // 回复
  invitations: 3,// 邀请
};

export {commentTypeIdConfig}

export async function getCommentList(values) {
  const {ct, ...rest} = values
  return ajax(`/askapi/FindAllAsk`, { ...AppId, CommentTypeId: ct, ...rest }, 'GET', reqNews);
}

export async function changeAuditForComment(values) {
  return changeAuditForQA(values);
}

export async function removeCommentById(values) {
  return removeQAById(values);
}
