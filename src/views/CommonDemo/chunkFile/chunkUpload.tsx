import { defineComponent, ref } from "vue";
import type { AxiosInstance } from "axios";
import axios from "axios";
import { UploadFilled } from "@element-plus/icons-vue";
interface taskData {
  fileName: string;
  fileSize: number;
  file: File;
  todoList: Array<singleUploadParam>;
  fileLoaded: number;
  lastFileLoaded: number;
  progressValue: number;
  instance: AxiosInstance;
  flag: number;
  persistentFailureTime: number;
  errorList: Array<singleUploadParam>;
  tryTime: number;
}
interface addTaskData {
  fileName: string;
  fileSize: number;
  file: File;
}
interface singleUploadParam {
  formData: FormData;
  config: object;
}
export default defineComponent({
  name: "chunkUpload",
  props: {
    action: {
      type: String,
      default: "",
    },
  },
  setup(props) {
    const uploadInput = ref();
    const taskList = ref<any[]>([]);
    const maxTryTime = 3;
    const handleBtnClick = () => {
      uploadInput.value.click();
    };
    const uploadFileChange = (e: Event) => {
      const file = uploadInput.value.files[0];
      addTask({
        fileName: file.name,
        fileSize: file.size,
        file: file,
      });
    };
    const addTask = (data: addTaskData) => {
      const task = {
        taskId: randomString(8), // 任务id
        todoList: [], // 待办分片列表
        errorList: [], // 失败列表
        tryTime: 0, // 失败尝试次数
        flag: 0, // 指针
        isSendErrorMessage: false, // 是否已发送错误信息
        isPause: false, // 暂停状态
        handleUpload: null, // 下载方法
        fileName: data.fileName, // 文件名
        fileSize: data.fileSize, // 文件大小
        file: data.file, // 文件流
        fileLoaded: 0, // 当前加载大小
        lastFileLoaded: 0, // 上一次加载大小
        progressValue: 0, // 进度值
        persistentFailureTime: 0, // 连续失败次数
        instance: axios.create(),
      };
      taskList.value.push(task);
      const chunks = sliceFile(task.file);
      handleChunksUpload(chunks, task);
    };
    const randomString = (len = 32) => {
      const $chars =
        "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678"; /** **默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
      const maxPos = $chars.length;
      let pwd = "";
      for (let i = 0; i < len; i++) {
        pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
      }
      return pwd;
    };
    const sliceFile = (file: File, piece = 1024 * 1000 * 1) => {
      const totalSize = file.size; // 文件总大小
      let start = 0; // 每次上传的开始字节
      let end = start + piece; // 每次上传的结尾字节
      const chunks = [];
      while (start < totalSize) {
        // 根据长度截取每次需要上传的数据
        // File对象继承自Blob对象，因此包含slice方法
        const blob = file.slice(start, end);
        chunks.push(blob);
        start = end;
        end = start + piece;
      }
      return chunks;
    };
    const handleChunksUpload = (chunks: Array<Blob>, task: taskData) => {
      const config = {
        headers: {
          contentType: false, // 改成 false 就会改掉之前默认的数据格式，在上传文件时不报错
          processData: false, // 上传文件的时候，则不需要把其转换为字符串，因此要改成false
        },
        onUploadProgress: (progress: ProgressEvent) => {
          let load = task.fileLoaded;
          if (progress.loaded >= progress.total) {
            load = task.fileLoaded + progress.loaded;
            task.lastFileLoaded = task.fileLoaded;
            task.fileLoaded += progress.loaded;
          } else {
            load = task.fileLoaded + progress.loaded;
          }
          if ((load * 100) / Number(task.fileSize) <= 100) {
            task.progressValue = (load * 100) / Number(task.fileSize);
          } else {
            task.progressValue = 100;
          }
          task.progressValue = Math.round(task.progressValue);
        },
      };
      chunks.forEach((chunk: Blob, index: number) => {
        const formData = new FormData();
        formData.set("file", chunk);
        formData.set("fileName", task.fileName);
        formData.set("chunk", index.toString()); // 分片index
        formData.set("size", chunk.size.toString());
        formData.set("chunkTotal", chunks.length.toString());
        task.todoList.push({ formData, config });
      });
      handleSingleChunkUpload(task);
    };
    const handleSingleChunkUpload = (task: taskData) => {
      const singleUpload = task.todoList[task.flag];
      task.instance
        .post(props.action, singleUpload.formData, singleUpload.config)
        .then((res) => {
          console.log(res);
          task.persistentFailureTime = 0;
          task.flag += 1;
          if (task.flag > task.todoList.length - 1) {
            if (task.errorList.length == 0) {
              task.flag = 0;
              task.lastFileLoaded = 0;
              task.fileLoaded = 0;
              task.progressValue = 0;
            } else {
              if (task.tryTime > maxTryTime) {
                console.log("超过最大重试次数！");
              } else {
                task.tryTime += 1;
                task.todoList = task.errorList;
                task.errorList = [];
                task.flag = 0;
                handleSingleChunkUpload(task);
              }
            }
          } else {
            handleSingleChunkUpload(task);
          }
        });
    };
    return () => {
      return (
        <div class={"upload"}>
          <el-button icon={UploadFilled} onClick={handleBtnClick}>
            上传
          </el-button>
          <input
            ref={uploadInput}
            type="file"
            class={"upload__input"}
            onChange={uploadFileChange}
          />
          <el-scrollbar tag="ul" max-height="312px">
            {taskList.value.map((item) => {
              return (
                <li>
                  {item.fileName}
                  <el-progress
                    stroke-width={4}
                    percentage={Number(item.progressValue)}
                  />
                </li>
              );
            })}
          </el-scrollbar>
        </div>
      );
    };
  },
});
