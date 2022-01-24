const labels = ["Review Document","Attachments (Optional)","Action and Recipients","Release"];

const customStyles = {    
    stepIndicatorSize: 45,
    currentStepIndicatorSize:45,
    separatorStrokeWidth: 2,
    currentStepStrokeWidth: 3,
    stepStrokeCurrentColor: '#fe7013',
    stepStrokeWidth: 3,
    stepStrokeFinishedColor: '#fe7013',
    stepStrokeUnFinishedColor: '#aaaaaa',
    separatorFinishedColor: '#fe7013',
    separatorUnFinishedColor: '#aaaaaa',
    stepIndicatorFinishedColor: '#fe7013',
    stepIndicatorUnFinishedColor: '#ffffff',
    stepIndicatorCurrentColor: '#ffffff',
    stepIndicatorLabelFontSize: 13,
    currentStepIndicatorLabelFontSize: 13,
    stepIndicatorLabelCurrentColor: '#fe7013',
    stepIndicatorLabelFinishedColor: '#ffffff',
    stepIndicatorLabelUnFinishedColor: '#aaaaaa',
    labelColor: '#999999',
    labelSize: 13,
    currentStepLabelColor: '#fe7013'
  }

const getStepIndicatorIconConfig = ({
    position,
    stepStatus,
  }: {
    position: number;
    stepStatus: string;
  }) => {
    const iconConfig = {
      name: 'clip',
      color: stepStatus === 'finished' ? '#ffffff' : '#fe7013',
      size: 16,
    };
    switch (position) {
      case 0: {
        iconConfig.name = 'file-alt';
        break;
      }
      case 1: {
        iconConfig.name = 'file-import';
        break;
      }
      case 2: {
        iconConfig.name = 'users';
        break;
      }     
      case 3: {
        iconConfig.name = 'paper-plane';
        break;
      }     
      default: {
        break;
      }
    }
    return iconConfig;
  };
  

  export default {customStyles,getStepIndicatorIconConfig,labels }