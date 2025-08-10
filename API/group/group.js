import { request } from '../../request/request.js';
export const searchGroup = (data) => {
  return request({
    url: '/group/searchGroup',
    method: 'POST',
    data:{
      searchContext:data.searchContext,
      currentPage:data.currentPage,
      canJoin:data.canJoin
    }
  });
}
export const getMyGroup = (data) => {
  return request({
    url: '/group/getMyGroup',
    method: 'GET',
    data
  });
}
export const createGroup = (data) => {
  return request({
    url: '/group/createGroup',
    method: 'POST',
    data:{
        leader:localStorage.getItem('id'),
        groupName:data.groupName,
        slogan:data.slogan,
        rule:data.rule,
        canJoin:data.canJoin
    }
  });
}
export const updateHead = (data) => {
  return request({
    url: '/group/updateHead',
    method: 'POST',
    data
  });
}
export const updateGroup = (data) => {
  return request({
    url: '/group/updateGroup',
    method: 'POST',
    data:{
        slogan:data.slogan,
        rule:data.rule,
        groupName:data.groupName
    }
  });
}
export const deleteGroup = (data) => {
  return request({
    url: '/group/deleteGroup',
    method: 'POST',
    data:{
        groupId:data.groupId
    }
  });
}
export const transferGroup = (data) => {
  return request({
    url: '/group/transferGroup',
    method: 'POST',
    data:{
        groupId:data.groupId,
        newLeader:data.newLeader
    }
  });
}
export const changeDeputy = (data) => {
  return request({
    url: '/group/changeDeputy',
    method: 'POST',
    data:{
        groupId:data.groupId,
        deputy:data.deputy
    }
  });
}
export const changeCanJoin = (data) => {
  return request({
    url: '/group/changeCanJoin',
    method: 'POST',
    data:{
        groupId:data.groupId,
        canJoin:data.canJoin
    }
  });
}
export const contributionGroup = (data) => {
  return request({
    url: '/group/contributionGroup',
    method: 'POST',
    data:{
        groupId:data.groupId
    }
  });
}
export const invitePredecessor = (data) => {
  return request({
    url: '/group/invitePredecessor',
    method: 'POST',
    data:{
        groupId:data.groupId,
        predecessorId:data.predecessorId,
        status:data.status
    }
  });
}
export const clearPredecessor = (data) => {
  return request({
    url: '/group/clearPredecessor',
    method: 'POST',
    data:{
        groupId:data.groupId,
        predecessorId:data.predecessorId,
        status:data.status
    }
  });
}









