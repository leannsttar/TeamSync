import React, { useState, useRef, useEffect, useContext, memo } from "react";

import { ProyectosContext } from "@/config/ProyectosContext";
import { useSession } from "@/config/useSession";

import { Loader } from "@/components/Loader";

import "../../../index.css";

import { useParams } from "react-router-dom";

import { format, formatDistanceToNow, parseISO } from "date-fns";
import { es } from "date-fns/locale";

import { clienteAxios } from "@/config/clienteAxios";

import LinkPreview from "@ashwamegh/react-link-preview";

// If you're using built in layout, you will need to import this css
import "@ashwamegh/react-link-preview/dist/index.css";

import { FaPlus } from "react-icons/fa6";
import { TbEdit } from "react-icons/tb";
import { PiListChecks } from "react-icons/pi";
import { PiList } from "react-icons/pi";

import { TaskCardProject } from "@/components/(logged in)/TaskCardProject";

import plusTasksIcon from "../../../assets/plusTasksIcon.svg";
import avatar from "../../../assets/Avatar.jpg";

import Microlink from "@microlink/react";
import styled, { StyleSheetManager } from "styled-components";
import isPropValid from "@emotion/is-prop-valid";

import {
  Button,
  Col,
  DatePicker,
  Drawer,
  Form,
  Input,
  Row,
  Select,
  Space,
  Flex,
  Progress,
  Checkbox,
  TreeSelect,
  message,
  Upload,
} from "antd";
const { Option } = Select;

import {
  InboxOutlined,
  MinusCircleOutlined,
  PlusOutlined,
  SendOutlined,
  UploadOutlined,
} from "@ant-design/icons";
const { Dragger } = Upload;
const fileList = [
  {
    uid: "0",
    name: "archivo1.png",
    status: "done",
    percent: 33,
    url: "https://i.pinimg.com/564x/be/d9/c7/bed9c79272193572180299e91c800745.jpg",
    thumbUrl:
      "https://i.pinimg.com/564x/be/d9/c7/bed9c79272193572180299e91c800745.jpg",
  },
  {
    uid: "-1",
    name: "archivo2.png",
    status: "done",
    url: "https://i.pinimg.com/564x/be/d9/c7/bed9c79272193572180299e91c800745.jpg",
    thumbUrl:
      "https://i.pinimg.com/564x/be/d9/c7/bed9c79272193572180299e91c800745.jpg",
  },
  {
    uid: "-2",
    name: "archivo3.png",
    status: "done",
    url: "https://i.pinimg.com/564x/be/d9/c7/bed9c79272193572180299e91c800745.jpg",
    thumbUrl:
      "https://i.pinimg.com/564x/be/d9/c7/bed9c79272193572180299e91c800745.jpg",
  },
];
const props = {
  action: "https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload",
  onChange({ file, fileList }) {
    if (file.status !== "uploading") {
      console.log(file, fileList);
    }
  },
  defaultFileList: [
    {
      uid: "1",
      name: "archivo1.png",
      status: "uploading",
      url: "http://www.baidu.com/xxx.png",
      percent: 33,
    },
    {
      uid: "2",
      name: "archivo2.png",
      status: "done",
      url: "http://www.baidu.com/yyy.png",
    },
    {
      uid: "3",
      name: "archivo3.png",
      status: "error",
      response: "Server Error 500",
      // custom error message to show
      url: "http://www.baidu.com/zzz.png",
    },
  ],
};

const HeaderTaskCards = memo(({ title, numCards, hidden, project }) => {
  const { usuario, userToken } = useSession();

  const params = useParams();

  const [open, setOpen] = useState(false);
  const [subtasks, setSubtasks] = useState([]);
  const [treeDataMembers, setTreeDataMembers] = useState([]);

  const [valueMembers, setValueMembers] = useState([]);
  const [valueTags, setValueTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [treeDataTags, setTreeDataTags] = useState([]);

  const [titleTask, setTitleTask] = useState("");
  const [dateTask, setDateTask] = useState("");
  const [descriptionTask, setDescriptionTask] = useState("");

  useEffect(() => {
    if (project.tags) {
      setTreeDataTags(
        project.tags.map((tag) => ({ value: tag.id, title: tag.name }))
      );
    }
  }, [project]);

  const [messageApi, contextHolder] = message.useMessage();

  const handleAddNewTag = async () => {
    try {
      if (newTag == "") {
        messageApi.open({
          type: "error",
          content: "No puedes dejar la etiqueta en blanco",
        });
        return;
      }

      let tagExists = false;
      treeDataTags.map((tag) => {
        if (newTag == tag.title) {
          messageApi.open({
            type: "warning",
            content: "Esta etiqueta ya existe",
          });
          tagExists = true;
          return;
        }
      });

      if (!tagExists) {
        const formData = new FormData();

        formData.append("projectoId", project.id);
        formData.append("tag", newTag);

        setNewTag("");

        const response = await clienteAxios.postForm(
          `/api/tasks/createTag`,
          formData,
          {
            headers: {
              Authorization: "Bearer " + userToken,
            },
          }
        );

        const newTagData = {
          title: newTag,
          value: response.data.id,
          key: response.data.id,
        };

        setTreeDataTags([...treeDataTags, newTagData]);
        setValueTags([...valueTags, newTagData.value]);

        messageApi.open({
          type: "success",
          content: "Etiqueta creada correctamente",
        });
      }
    } catch (error) {
      messageApi.open({
        type: "error",
        content: "Hubo un error al crear la etiqueta",
      });
      console.error("Error al enviar los datos", error);
    }
  };

  const handleNewTagChange = (e) => {
    setNewTag(e.target.value);
  };

  useEffect(() => {
    if (project != "loading") {
      setTreeDataMembers(
        project.team.map((member) => {
          return {
            value: member.user.id,
            title: (
              <div className="flex items-center gap-2">
                <img
                  src={member.user.image}
                  className="w-4 h-4 rounded-full object-cover"
                />
                <p>{member.user.name}</p>
              </div>
            ),
          };
        })
      );
    }
  }, [project]);

  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  const onChangeMembers = (newValue) => {
    setValueMembers(newValue);
  };

  const onChangeTags = (newValue) => {
    setValueTags(newValue);
  };

  const handleAddSubtask = () => {
    setSubtasks([...subtasks, ""]);
  };

  const handleRemoveSubtask = (index) => {
    const updatedSubtasks = [...subtasks];
    updatedSubtasks.splice(index, 1);
    setSubtasks(updatedSubtasks);
  };

  const handleSubtaskChange = (event, index) => {
    const updatedSubtasks = [...subtasks];
    const newSubtask = event.target.value.trim();
    if (newSubtask !== "") {
      updatedSubtasks[index] = newSubtask;
      setSubtasks(updatedSubtasks);
    }
  };

  const onChangeDate = (date, dateString) => {
    setDateTask(dateString);
  };

  const createTask = async () => {
    try {
      if (!titleTask.trim()) {
        messageApi.open({
          type: "error",
          content: "El título de la tarea es obligatorio",
        });
        return;
      }

      if (!dateTask) {
        messageApi.open({
          type: "error",
          content: "La fecha de entrega es obligatoria",
        });
        return;
      }

      if (valueMembers.length === 0) {
        messageApi.open({
          type: "error",
          content: "Debes seleccionar al menos un miembro",
        });
        return;
      }

      if (valueTags.length === 0) {
        messageApi.open({
          type: "error",
          content: "Debes seleccionar al menos una etiqueta",
        });
        return;
      }

      if (!descriptionTask.trim()) {
        messageApi.open({
          type: "error",
          content: "La descripción de la tarea es obligatoria",
        });
        return;
      }

      const formData = new FormData();

      const filteredSubtasks = subtasks.filter(
        (subtask) => subtask.trim() !== ""
      );
      if (filteredSubtasks.length > 0) {
        formData.append("subtasks", JSON.stringify(filteredSubtasks));
      }

      formData.append("projectId", params.id);
      formData.append("authorId", usuario.id);
      formData.append("title", titleTask);
      formData.append("date", dateTask);
      formData.append("members", JSON.stringify(valueMembers));
      formData.append("tags", JSON.stringify(valueTags));
      formData.append("description", descriptionTask);

      const response = await clienteAxios.postForm(
        "/api/tasks/createTask",
        formData,
        {
          headers: {
            Authorization: "Bearer " + userToken,
          },
        }
      );

      messageApi.open({
        type: "success",
        content: "Tarea creada correctamente",
      });

      console.log("Respuesta del backend:", response.data);
    } catch (error) {
      messageApi.open({
        type: "error",
        content: "Hubo un error al crear la tarea",
      });
      console.error("Error al enviar los datos", error);
    }
  };

  return (
    <>
      {contextHolder}
      <Drawer
        title="Crea una nueva tarea"
        width={720}
        onClose={onClose}
        open={open}
        styles={{
          body: {
            paddingBottom: 80,
          },
        }}
        extra={
          <Space>
            <Button onClick={onClose}>Cancelar</Button>
            <Button onClick={createTask} className="bg-black text-white">
              Crear tarea
            </Button>
          </Space>
        }
      >
        <Form layout="vertical" hideRequiredMark>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="title"
                label="Título"
                rules={[
                  {
                    required: true,
                    message: "El título es obligatorio",
                  },
                ]}
              >
                <Input
                  placeholder="Ingresa el título"
                  onChange={(e) => setTitleTask(e.target.value)}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="dateTime"
                label="Fecha de entrega"
                rules={[
                  {
                    required: true,
                    message: "Por favor elige una fecha",
                  },
                ]}
              >
                <DatePicker
                  style={{
                    width: "100%",
                  }}
                  getPopupContainer={(trigger) => trigger.parentElement}
                  onChange={onChangeDate}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="members"
                label="Asignar a"
                rules={[
                  {
                    required: true,
                    message: "Seleccione al menos a 1 miembro",
                  },
                ]}
              >
                <TreeSelect
                  showSearch
                  style={{
                    width: "100%",
                  }}
                  value={valueMembers}
                  dropdownStyle={{
                    maxHeight: 400,
                    overflow: "auto",
                  }}
                  placeholder="Seleccione a los miembros"
                  allowClear
                  multiple
                  treeDefaultExpandAll
                  onChange={onChangeMembers}
                  treeData={treeDataMembers}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="tags"
                label="Etiquetas"
                rules={[
                  {
                    required: true,
                    message: "Por favor elija al menos 1 etiqueta",
                  },
                ]}
              >
                <TreeSelect
                  showSearch
                  style={{
                    width: "100%",
                  }}
                  value={valueTags}
                  dropdownStyle={{
                    maxHeight: 400,
                    overflow: "auto",
                  }}
                  placeholder="Seleccione las etiquetas"
                  allowClear
                  multiple
                  treeDefaultExpandAll
                  onChange={onChangeTags}
                  treeData={treeDataTags}
                />
                <div className="mt-3 flex gap-1">
                  <input
                    type="text"
                    value={newTag}
                    onChange={handleNewTagChange}
                    placeholder="Crear nueva etiqueta"
                    className="outline-none py-1 px-2 border-[1px] border-gray-300 rounded-md custom-placeholder"
                    style={{ placeholder: { color: "#fff" } }}
                  />

                  <Button onClick={handleAddNewTag}>Agregar</Button>
                </div>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="description"
                label="Descripción"
                rules={[
                  {
                    required: true,
                    message: "Escribe una descripción de la tarea",
                  },
                ]}
              >
                <Input.TextArea
                  rows={4}
                  placeholder="Escribe una descripción de la tarea"
                  onChange={(e) => setDescriptionTask(e.target.value)}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item label="Subtareas">
                {subtasks.map((subtask, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between mb-2"
                  >
                    <Input
                      value={subtask.name}
                      onChange={(event) => handleSubtaskChange(event, index)}
                      placeholder="Ingresa el nombre de la subtarea"
                      style={{ width: "90%" }}
                    />
                    <MinusCircleOutlined
                      className="cursor-pointer ml-2"
                      onClick={() => handleRemoveSubtask(index)}
                    />
                  </div>
                ))}
                <Button
                  type="dashed"
                  onClick={handleAddSubtask}
                  icon={<PlusOutlined />}
                >
                  Agregar subtarea
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Drawer>
      <div className="bg-[#F7F7F7] flex justify-between py-3 px-5 rounded-[1.5rem] lg:w-[80%]">
        <div>
          <p className="text-xl font-semibold">{title}</p>
          <p className="text-[#959595]">{numCards} tareas</p>
        </div>
        {hidden ?? (
          <img
            src={plusTasksIcon}
            alt="add icon"
            className="w-8 cursor-pointer"
            onClick={showDrawer}
          />
        )}
      </div>
    </>
  );
});

const ColTasks = ({ title, numCards, children, index, project }) => {
  return (
    <div key={index} className="space-y-3 lg:w-[30%] lg:space-y-8">
      {title === "Próximo" ? (
        <HeaderTaskCards title={title} numCards={numCards} project={project} />
      ) : (
        <HeaderTaskCards
          title={title}
          numCards={numCards}
          hidden
          project={project}
        />
      )}

      <div className="flex gap-3 overflow-auto pb-2 lg:flex-col lg:gap-6">
        {children}
      </div>
    </div>
  );
};

const SubTask = ({ name, index, taskId, isChecked, refreshProject }) => {
  const { userToken } = useSession();

  const [check, setCheck] = useState(isChecked);

  const [messageApi, contextHolder] = message.useMessage();

  const onChange = async (e) => {
    try {
      setCheck(!check);
      const formData = new FormData();

      formData.append("taskId", taskId);
      if (check) {
        formData.append("status", "pendiente");
      } else if (!check) {
        formData.append("status", "terminado");
      }

      const response = await clienteAxios.putForm(
        `/api/tasks/updateSubtask`,
        formData,
        {
          headers: {
            Authorization: "Bearer " + userToken,
          },
        }
      );

      refreshProject();
    } catch (error) {
      messageApi.open({
        type: "error",
        content: "Hubo un error al marcar la tarea",
      });
      console.error("Error al enviar los datos", error);
    }
  };

  return (
    <>
      {contextHolder}
      <div
        key={index}
        className={`flex items-center gap-2 w-full ${
          isChecked ? "true" : "false"
        }`}
      >
        <PiList size={22} className="pb-2" />
        <Checkbox
          onChange={onChange}
          className="text-[1rem] pb-2 border-b-[1px] border-gray-300 w-full mr-6"
          checked={check}
        >
          {name}
        </Checkbox>
      </div>
    </>
  );
};

const CommentComponent = ({ userName, userPicture, message, timeAgo, key }) => {
  return (
    <div key={key} className="space-y-1">
      <div className="flex items-center gap-3">
        <img
          src={userPicture}
          alt=""
          className="min-h-8 min-w-8 max-h-8 max-w-8 rounded-full object-cover"
        />
        <div className="flex items-center gap-2">
          <p className="font-medium">{userName}</p>
          <div className="rounded-full bg-gray-600 w-1 h-1"></div>
          <p className="text-[.8rem] text-gray-500">{timeAgo}</p>
        </div>
      </div>
      <p>{message}</p>
      <hr />
    </div>
  );
};

export const BoardTab = () => {
  const { usuario, userToken } = useSession();

  const params = useParams();

  const timerRef = useRef();

  const [open, setOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [section, setSection] = useState("progreso");

  const [project, setProject] = useState("loading");
  const [taskUrl, setTaskUrl] = useState("");
  const [taskComment, setTaskComment] = useState("");

  const [upcomingTasks, setUpcomingTasks] = useState([]);

  const getProject = async () => {
    try {
      setLoading(true);
      const response = await clienteAxios.get(
        `/api/projects/getProjectBoard/${params.id}`
      );
      setProject(response.data);
      setUpcomingTasks(
        response.data.tasks.map((task) => {
          let progressList = 0;

          return {
            id: task.id,
            title: task.name,
            tags: task.tags.map(
              (taskTag) =>
                response.data.tags.find(
                  (projectTag) => projectTag.id === taskTag.tagId
                ).name
            ),
            description: task.description,
            subTasks: task.subTasks,
            progressList: task.subTasks.filter(
              (subTask) => subTask.status == "terminado"
            ).length,
            date: format(new Date(task.due_date), "PP"),
            members: task.assignees.map(
              (assignee) =>
                response.data.team.find(
                  (projectMember) => projectMember.user.id === assignee.userId
                ).user.image
            ),
            files: task.files,
            links: task.links,
            comments: task.comments.map((comment) => {
              const creator = response.data.team.find(
                (member) => member.user.id === comment.authorId
              );

              let timeAgo = "Invalid date";
              try {
                const commentDate = parseISO(comment.createdAt);
                timeAgo = formatDistanceToNow(commentDate, {
                  addSuffix: true,
                  locale: es,
                });
              } catch (error) {
                console.error("Error parsing comment date:", error);
              }

              return {
                id: comment.id,
                text: comment.content,
                timeAgo: timeAgo, // Calculating time ago
                creatorId: creator.user.id,
                creatorImage: creator.user.image,
                creatorName: creator.user.name,
              };
            }),
            status: task.status,
          };
        })
      );
      if (selectedTask) {
        const task = response.data.tasks.find(
          (task) => task.id === selectedTask.id
        );
        const updatedSelectedTask = {
          id: task.id,
          title: task.name,
          tags: task.tags.map(
            (taskTag) =>
              response.data.tags.find(
                (projectTag) => projectTag.id === taskTag.tagId
              ).name
          ),
          description: task.description,
          subTasks: task.subTasks,
          progressList: task.subTasks.filter(
            (subTask) => subTask.status == "terminado"
          ).length,
          date: format(new Date(task.due_date), "PP"),
          members: task.assignees.map(
            (assignee) =>
              response.data.team.find(
                (projectMember) => projectMember.user.id === assignee.userId
              ).user.image
          ),
          files: task.files,
          links: task.links,
          comments: task.comments.map((comment) => {
            const creator = response.data.team.find(
              (member) => member.user.id === comment.authorId
            );

            let timeAgo = "Invalid date";
            try {
              const commentDate = parseISO(comment.createdAt);
              timeAgo = formatDistanceToNow(commentDate, {
                addSuffix: true,
                locale: es,
              });
            } catch (error) {
              console.error("Error parsing comment date:", error);
            }

            return {
              id: comment.id,
              text: comment.content,
              timeAgo: timeAgo, // Calculating time ago
              creatorId: creator.user.id,
              creatorImage: creator.user.image,
              creatorName: creator.user.name,
            };
          }),
          status: task.status,
        };
        setSelectedTask(updatedSelectedTask);
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.log("Error al obtener el proyecto:", error);
    }
  };

  useEffect(() => {
    getProject();
    console.log("pr");
  }, [params.id]);

  const [messageApi, contextHolder] = message.useMessage();

  const createLink = async () => {
    try {
      const formData = new FormData();

      formData.append("authorId", usuario.id);
      formData.append("taskId", selectedTask.id);
      formData.append("link", taskUrl);

      const response = await clienteAxios.postForm(
        `/api/tasks/createLink`,
        formData,
        {
          headers: {
            Authorization: "Bearer " + userToken,
          },
        }
      );

      getProject();

      messageApi.open({
        type: "success",
        content: "Link agregado exitosamente",
      });
    } catch (error) {
      messageApi.open({
        type: "error",
        content: "Hubo un error al guardar el link",
      });
      console.error("Error al enviar los datos", error);
    }
  };

  const handleKeyDownLink = (e) => {
    if (e.key === "Enter") {
      createLink();
    }
  };

  const createComment = async () => {
    try {
      const formData = new FormData();

      formData.append("authorId", usuario.id);
      formData.append("taskId", selectedTask.id);
      formData.append("comment", taskComment);

      const response = await clienteAxios.postForm(
        `/api/tasks/createComment`,
        formData,
        {
          headers: {
            Authorization: "Bearer " + userToken,
          },
        }
      );

      getProject();

      messageApi.open({
        type: "success",
        content: "Comentario agregado exitosamente",
      });
    } catch (error) {
      messageApi.open({
        type: "error",
        content: "Hubo un error al guardar el comentario",
      });
      console.error("Error al enviar los datos", error);
    }
  };

  const handleKeyDownComment = (e) => {
    if (e.key === "Enter") {
      createComment();
    }
  };

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };

  const showDrawer = (task) => {
    setSelectedTask(task);
    setOpen(true);
    // setLoading(true);
    // timerRef.current = setTimeout(() => {
    //   setLoading(false);
    // }, 600);
  };

  const onClose = () => {
    setOpen(false);
  };

  function changeSection(newSection) {
    setSection(newSection);
  }

  useEffect(() => clearTimer, []);

  if (project == "loading" || project == undefined) return <Loader />;

  return (
    <>
      {contextHolder}
      <Drawer
        title={
          selectedTask
            ? selectedTask.status == "proximo"
              ? "Próximo"
              : selectedTask.status == "en progreso"
              ? "En progreso"
              : "Terminadas"
            : ""
        }
        width={700}
        height={isMobile && "85vh"}
        placement={isMobile ? "bottom" : "right"}
        onClose={onClose}
        loading={loading}
        open={open}
        styles={{ body: { padding: "2rem", fontFamily: "Inter" } }}
        footer={
          <div
            className={`${
              section === "progreso" && "hidden"
            } m-2 flex items-center gap-3 relative`}
          >
            <img
              src={usuario.image}
              alt=""
              className="min-w-10 min-h-10 max-w-10 max-h-10 rounded-full object-cover"
            />

            {section === "archivos" ? (
              <>
                <input
                  onChange={(e) => setTaskUrl(e.target.value)}
                  onKeyDown={handleKeyDownLink}
                  className="rounded-2xl bg-[#f0f0f0] px-3 py-2 outline-none w-full mr-4"
                  type="text"
                  placeholder={"Copia el link aquí"}
                  name=""
                  id=""
                />
                <SendOutlined
                  className="absolute right-8"
                  onClick={createLink}
                />
              </>
            ) : (
              <>
                <input
                  onChange={(e) => setTaskComment(e.target.value)}
                  onKeyDown={handleKeyDownComment}
                  className="rounded-2xl bg-[#f0f0f0] px-3 py-2 outline-none w-full mr-4"
                  type="text"
                  placeholder={"Comenta aquí"}
                  name=""
                  id=""
                />
                <SendOutlined
                  className="absolute right-8"
                  onClick={createComment}
                />
              </>
            )}
          </div>
        }
      >
        {selectedTask ? (
          <>
            <p className="text-5xl font-semibold">{selectedTask.title}</p>
            <table className="w-full my-5">
              <tbody>
                <tr>
                  <td className="text-[#9b9b9b] font-medium py-2 w-[7rem]">
                    Estado
                  </td>
                  <td className="font-medium py-2">
                    {selectedTask.status === "proximo"
                      ? "Próximo"
                      : selectedTask.status === "en progreso"
                      ? "En progreso"
                      : "Terminadas"}
                  </td>
                </tr>
                <tr>
                  <td className="text-[#9b9b9b] font-medium py-2">Asignados</td>
                  <td className="font-medium py-2">
                    <div className="flex">
                      {selectedTask.members.map((img, index) => {
                        return (
                          <img
                            key={index}
                            src={img}
                            className={` ${
                              index === 1
                                ? " right-2"
                                : index === 2
                                ? "right-4"
                                : ""
                            } relative rounded-full min-w-[2rem] min-h-[2rem] max-w-[2rem] max-h-[2rem]`}
                          />
                        );
                      })}
                      <div className="flex items-center justify-center rounded-full w-[2rem] h-[2rem] bg-[#e6e6e6] relative right-3 cursor-pointer">
                        <FaPlus />
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="text-[#9b9b9b] font-medium py-2">
                    Fecha límite
                  </td>
                  <td className="font-medium py-2">{selectedTask.date}</td>
                </tr>
                <tr>
                  <td className="text-[#9b9b9b] font-medium py-2">Etiquetas</td>
                  <td className="font-medium py-2">
                    <div className="flex gap-2 flex-wrap">
                      {selectedTask.tags.map((tag, index) => {
                        return (
                          <p
                            key={index}
                            className="bg-[#f5f5f5] text-[#959595] px-2 py-1 rounded-2xl"
                          >
                            {tag}
                          </p>
                        );
                      })}
                      <p className="border-[1px] flex items-center gap-1 text-[#000] px-2 py-1 rounded-2xl cursor-pointer">
                        {isMobile ? "Añadir" : "Añadir etiqueta"}
                        <span>
                          <FaPlus />
                        </span>
                      </p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <p className="text-2xl font-semibold">Descripción</p>
                <TbEdit size={23} opacity={0.4} className="cursor-pointer" />
              </div>
              <p className="text-[#5c5c5c]">{selectedTask.description}</p>
            </div>
            <div className="mt-10">
              <div className="flex text-[1.05rem] gap-2 lg:gap-5">
                <p
                  onClick={() => {
                    changeSection("progreso");
                  }}
                  className={`${
                    section === "progreso"
                      ? "border-black text-black"
                      : "border-white text-gray-500 hover:text-black"
                  }  px-2 lg:px-4 pb-1 border-b-[3px] hover:border-black cursor-pointer`}
                >
                  Progreso
                </p>
                <p
                  onClick={() => {
                    changeSection("archivos");
                  }}
                  className={`${
                    section === "archivos"
                      ? "border-black text-black"
                      : "border-white text-gray-500 hover:text-black"
                  } px-2 lg:px-4 pb-1 border-b-[3px] hover:border-black cursor-pointer`}
                >
                  Archivos
                </p>
                <div
                  onClick={() => {
                    changeSection("comentarios");
                  }}
                  className={`${
                    section === "comentarios"
                      ? "border-black text-black"
                      : "border-white text-gray-500 hover:text-black"
                  } flex items-center gap-1 px-2 lg:px-4 pb-1 border-b-[3px] hover:border-black cursor-pointer`}
                >
                  <p className="">Comentarios</p>
                  <div className="w-6 h-6 grid place-content-center text-white text-[.75rem] bg-black rounded-full">
                    {selectedTask.comments.length}
                  </div>
                </div>
              </div>
              <hr />
              <div>
                {section === "progreso" ? (
                  <div className="m-4">
                    <div className="flex justify-between items-center">
                      <p className="text-lg font-medium">Lista de progreso</p>
                      <div className="flex items-center gap-2">
                        <PiListChecks size={20} />
                        <p>
                          {selectedTask.progressList}/
                          {selectedTask.subTasks.length}
                        </p>
                      </div>
                    </div>
                    <Flex gap="small" vertical>
                      <Progress
                        percent={
                          selectedTask.subTasks.length > 0
                            ? (selectedTask.progressList /
                                selectedTask.subTasks.length) *
                              100
                            : 0
                        }
                        showInfo={false}
                        strokeColor={"black"}
                      />
                    </Flex>
                    <div className="mt-6 space-y-3">
                      {selectedTask.subTasks.map((task, index) => {
                        return (
                          <SubTask
                            key={task.id}
                            index={index}
                            taskId={task.id}
                            name={task.name}
                            isChecked={task.status == "terminado"}
                            refreshProject={getProject}
                          />
                        );
                      })}
                    </div>
                  </div>
                ) : section === "archivos" ? (
                  <div className="m-4">
                    <p className="text-lg font-medium mb-1">Subir archivos</p>
                    {/* <Dragger {...props} defaultFileList={[...fileList]}>
                      <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                      </p>
                      <p className="ant-upload-text">
                        Haz clic o arrastra el archivo a esta área para subirlo
                      </p>
                      <p className="ant-upload-hint">
                        Soporte para subida individual o en masa. Está
                        estrictamente prohibido subir datos de la empresa u
                        otros archivos prohibidos.
                      </p>
                    </Dragger> */}
                    <Upload {...props}>
                      <Button icon={<UploadOutlined />}>
                        Click para subir
                      </Button>
                    </Upload>
                    <p className="text-lg font-medium mt-6">Adjuntar links</p>
                    <div className="mt-1 space-y-1">
                      <StyleSheetManager shouldForwardProp={isPropValid}>
                        {selectedTask.links.map((link) => {
                          return <Microlink url={link.url} />;
                        })}
                      </StyleSheetManager>
                    </div>
                  </div>
                ) : section === "comentarios" ? (
                  <div className="mt-4">
                    <p className="text-lg font-medium mt-6">Comentar</p>
                    <div className="space-y-5 mt-3">
                      {selectedTask.comments.map((comment) => {
                        return (
                          <CommentComponent
                            key={comment.id}
                            userPicture={comment.creatorImage}
                            userName={comment.creatorName}
                            timeAgo={comment.timeAgo}
                            message={comment.text}
                          />
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
          </>
        ) : (
          "hi"
        )}
      </Drawer>
      <div className="mx-5 my-9 lg:mx-11 lg:my-16 space-y-10 lg:flex lg:space-y-0 lg:justify-around">
        <ColTasks title={"Próximo"} numCards={12} index={1} project={project}>
          {upcomingTasks.map((task, index) => (
            <TaskCardProject
              index={task.id}
              taskData={task}
              onClick={() => showDrawer(task)}
              mobile
            />
          ))}
        </ColTasks>
        <ColTasks
          title={"En proceso"}
          numCards={12}
          index={2}
          project={project}
        >
          {/* {upcomingTasks.map((task, index) => (
            <TaskCardProject
              index={task.id}
              taskData={task}
              onClick={() => showDrawer(task)}
              mobile
            />
          ))} */}
        </ColTasks>
        <ColTasks
          title={"Terminadas"}
          numCards={12}
          index={3}
          project={project}
        >
          {/* {upcomingTasks.map((task, index) => (
            <TaskCardProject
              index={task.id}
              taskData={task}
              onClick={() => showDrawer(task)}
              mobile
            />
          ))} */}
        </ColTasks>
      </div>
    </>
  );
};
