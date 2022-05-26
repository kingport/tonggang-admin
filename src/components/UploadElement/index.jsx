/* 上传组件 */
import React from 'react';
import isEqual from 'lodash/isEqual';
import { Upload, message, Modal, Image } from 'antd';
import { LoadingOutlined, FileAddOutlined } from '@ant-design/icons';
import './index.less';

// import * as service from '@/service/assetManagement';

const { Dragger } = Upload;

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => (callback ? callback(reader.result) : ''));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isJpgOrPng =
    file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/bmp';
  if (!isJpgOrPng) {
    message.error('图片扩展名必须为.png .jpeg .bmp!');
  }
  // 不能大于5M
  const isLt2M = file.size / 1024 / 1024 < 5;
  if (!isLt2M) {
    message.error('图片不能大于5M!');
  }
  return isJpgOrPng && isLt2M;
}

class UploadElement extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      fileList: [],
      imageUrl: '',
      previewVisible: false,
      loading: false,
    };
  }

  componentDidMount() {
    // console.log('componentDidMount)
    const { initialImageUrl, setField, itemName } = this.props;
    if (initialImageUrl) {
      setField({
        [itemName]: initialImageUrl || '',
      });
      this.updateImgurl(initialImageUrl);
    }
    // if (!isEqual(initialImageUrl, prevProps.initialImageUrl)) {
    //   this.updateImgurl(initialImageUrl);
    // }
    // console.log(initialImageUrl, 'initialImageUrl')
  }
  // 参数变化
  componentDidUpdate(prevProps) {
    const { initialImageUrl } = this.props;
    if (!isEqual(initialImageUrl, prevProps.initialImageUrl)) {
      this.updateImgurl(initialImageUrl);
    }
  }

  // 更新imgurl
  updateImgurl = (initialImageUrl) => {
    if (initialImageUrl) {
      this.setState({
        imageUrl: `${window.origin}/saasbench/v1/file/show/index?key=${initialImageUrl}`,
      });
    }
  };

  handleChange = (info) => {
    // console.log(info, 'info');
    const { setField, itemName } = this.props;
    // console.log(itemName, 'itemName')
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (imageUrl) => {
        // console.log(imageUrl, 'imageUrl')
        this.setState({
          imageUrl,
          loading: false,
        });
      });

      const { response } = info.file;
      // console.log(response, 'response')

      if (response.errno === 0) {
        const { data } = response;
        setField({
          [itemName]: data.key || '',
        });
        // console.log(data.key, 'data.key')
      }
    }
    if (info.file.status === 'removed') {
      this.setState({
        imageUrl: '',
        fileList: [],
      });
      const { response } = info.file;
      if (response.errno === 0) {
        setField({
          [itemName]: '',
        });
      }
    }
    // 只保留最后一个
    if (info.fileList.length > 0) {
      const fileItem = info.fileList[info.fileList.length - 1];
      this.setState({
        fileList: [fileItem],
      });
    }
  };

  handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    this.setState({
      previewVisible: true,
    });
  };

  handleCancel = () => this.setState({ previewVisible: false });
  // 点击图片放大
  showImg = (e) => {
    e.stopPropagation();
    this.setState({
      previewVisible: true,
    });
  };
  render() {
    const { uploadTxt = '', disabled } = this.props;
    const { imageUrl, loading, previewVisible, fileList = [] } = this.state;
    const uploadButton = (
      <div>
        {loading ? <LoadingOutlined /> : <FileAddOutlined style={{ fontSize: 30 }} />}
        <div style={{ textAlign: 'center', marginTop: 30 }} className="ant-upload-text">
          <div
            style={{ fontSize: 16, color: 'rgba(0,0,0,0.85)', fontFamily: 'PingFangSC-Regular' }}
          >
            <span style={{ marginRight: 5 }}>点击上传</span>
            <span style={{ fontFamily: 'PingFangSC-Medium', color: '#000' }}>{uploadTxt}</span>
          </div>
          <div style={{ color: 'rgba(0,0,0,0.43)' }}>支持扩展名：.png .jpg .jpeg</div>
          <div style={{ color: 'rgba(0,0,0,0.43)' }}>文件大小：不大于5M</div>
        </div>
      </div>
    );
    return (
      <div className="clearfix">
        <Dragger
          disabled={disabled}
          withCredentials
          fileList={fileList}
          // disabled={imageUrl}
          multiple
          accept=".jpg, .jpeg, .png"
          name="file" // 发到后台的文件参数名
          // listType="picture-card" // 上传列表的内建样式
          className="file-uploader"
          // showUploadList={false} // 是否展示文件列表,
          action={`${window.origin}/saasbench/v1/file/upload/index`} // 上传的地址
          // action={service.toUpload}
          beforeUpload={beforeUpload}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          <div
            style={{
              position: 'relative',
            }}
          >
            {imageUrl ? (
              <div
                onClick={(e) => this.showImg(e)}
                style={{ display: 'inline-block', maxHeight: 148 }}
              >
                <img
                  src={imageUrl}
                  alt="avatar"
                  style={{
                    maxWidth: '100%',
                    // width: '100%',
                    maxHeight: 148,
                  }}
                />
              </div>
            ) : (
              uploadButton
            )}
            {imageUrl && (
              <div
                style={{
                  position: 'absolute',
                  right: '1vw',
                  top: '0vw',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  zIndex: 999
                }}
              >
                <svg
                  t="1608191852071"
                  className="icon"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="3376"
                  width="32"
                  height="32"
                >
                  <path
                    d="M511.741935 420.645162 511.741935 420.645162 512 420.645162 512.516129 420.645162 511.741935 420.645162ZM495.483871 427.870968 306.32258 616.516129C297.032258 625.548387 297.032258 640.516128 306.32258 650.064518 315.354838 659.096774 330.580645 659.096774 339.870968 650.064518L488.258065 501.67742 488.258065 820.866362C488.258065 833.769587 498.83871 844.866362 512 844.866362 525.16129 844.866362 535.741935 833.769587 535.741935 820.866362L535.741935 501.67742 684.387098 650.064518C693.677421 659.096774 708.645158 659.096774 718.193549 650.064518 726.967744 640.516128 726.967744 625.548387 718.193549 616.516129L528.516129 427.870968 527.483871 426.83871 526.451613 425.806452C525.16129 424.516129 524.129032 424 523.612903 423.225807L522.32258 423.225807C520.774193 421.935484 519.741935 421.67742 518.451613 421.67742L516.129032 421.16129 514.32258 420.645162 512.516129 420.645162 509.935484 420.645162 507.870968 421.16129 505.806452 421.67742C504.516129 421.67742 503.225807 421.935484 502.193548 422.709677L500.903226 423.225807C499.870968 424 498.83871 424.516129 498.32258 425.032258L496.516129 426.32258 495.483871 427.870968ZM820.387098 766.451616C854.709677 766.193549 886.451616 752.258067 908.387098 729.806451 931.096774 706.580646 945.032256 675.612902 945.032256 640.516128 945.032256 609.548387 934.451616 581.67742 916.12903 559.225807 897.548384 537.290323 871.225805 521.806452 841.032256 516.645162 821.677421 512.774193 808 496.516129 808 477.67742L808 477.419355C808 402.83871 777.806451 334.709677 728.774195 285.935484 679.741933 236.903226 611.870968 206.451613 537.548387 206.451613 482.064516 206.451613 430.709677 222.967742 388.129032 250.580645 344 280.258065 309.16129 321.290323 288 370.580645 281.806452 385.290323 267.870968 394.32258 252.645162 394.83871 204.129032 397.419355 161.032258 418.83871 129.290323 452.645162 97.806452 485.419355 78.967742 530.580645 78.967742 580.129032 78.967742 631.741935 99.612903 678.451616 133.16129 712L133.67742 712C167.225807 745.806451 213.67742 766.451616 264.774193 766.451616L281.290323 766.451616 282.32258 766.451616 382.967742 766.451616 394.83871 766.451616C416.774193 766.451616 434.580645 784.516128 434.580645 805.935482 434.580645 827.354842 416.774193 845.419354 394.83871 845.419354L382.967742 845.419354 282.32258 845.419354 281.290323 845.419354 264.774193 845.419354C191.741935 845.419354 125.419355 816 77.419355 767.225805 29.677419 719.483872 0 653.161293 0 580.129032 0 510.193548 27.354839 445.67742 72.258065 398.193548 112 356.645162 165.67742 327.741935 225.548387 318.193548 253.419355 264 294.709677 218.83871 345.032258 185.806452 400.258065 149.16129 466.32258 128 537.548387 128 633.548387 128 721.032256 166.967742 784.516128 230.193548 841.032256 286.967742 878.451616 362.83871 885.935482 446.967742 921.032256 458.580645 952.258067 481.032258 975.741933 508.903226 1005.935482 544.516129 1024 590.709677 1024 640.516128 1024 697.290323 1001.032256 748.387098 964.12903 785.548384L963.87097 785.548384C931.612902 818.064518 888.258067 839.225805 840 844.645158 837.161293 844.903226 834.064518 845.419354 830.967744 845.419354L820.645158 845.419354 819.354842 845.419354 644.12903 845.419354 642.580646 845.419354C620.903226 845.419354 603.354838 827.354842 603.354838 805.935482 603.354838 784.516128 620.903226 766.451616 642.580646 766.451616L644.12903 766.451616 820.387098 766.451616Z"
                    p-id="3377"
                  ></path>
                </svg>
                <span>重新上传</span>
              </div>
            )}
          </div>
        </Dragger>
        <Modal
          title="点击图片可旋转、放大"
          visible={previewVisible}
          footer={null}
          onCancel={this.handleCancel}
        >
          {/* <img alt="图片" style={{ width: '100%' }} src={imageUrl} /> */}
          {previewVisible && <Image src={imageUrl} />}
        </Modal>
      </div>
    );
  }
}

export default UploadElement;
