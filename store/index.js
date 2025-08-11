import { createStore } from "vuex";
import article from './article/article';
import articleComment from './article/articleComment';
import task from './article/task';
import taskAnswer from './article/taskAnswer';
import group from './group/group';
import groupJoin from './group/groupJoin';
import groupTask from './group/groupTask';
import groupTaskAnswer from './group/groupTaskAnswer';
import groupUser from './group/groupUser';
import user from './user/user';
import userPlan from "./user/userPlan";
import userTask from "./user/userTask.js"

const store = createStore({
  modules: {
    user,
	userPlan,
	userTask,
    group,
    article,
    articleComment,
    task,
    taskAnswer,
    groupJoin,
    groupTask,
    groupTaskAnswer,
    groupUser
  }
});
export default store;