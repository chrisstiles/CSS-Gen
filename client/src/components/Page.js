import React from 'react';
import NavWindow from './NavWindow';
import { NotificationContainer } from 'react-notifications';
// import { getHeaderHeight } from '../util/helpers';

// const addNotification;
// let addNotification
// const notificationTypes = {
//   info: 'info',
//   warning: 'warning',
//   success: 'success',
//   error: 'error'
// }

// createNotification(type, message) {
//   NotificationManager[type](message, null, 4500);
// }

class Page extends React.Component {
  componentDidMount() {
    document.title = this.props.title || 'CSS-Gen';
  }

  render() {
    const { className, noSidebar, children } = this.props;
    const pageProps = { id: 'page-wrapper' };

    const wrapperClassName = [];
    if (className) wrapperClassName.push(className);
    if (noSidebar) wrapperClassName.push('no-sidebar');
    if (wrapperClassName.length) pageProps.className = wrapperClassName.join(' ');

    return (
      <div {...pageProps}>
        <NavWindow />
        {children}
        <NotificationContainer />
      </div>
    );
  }
}

// const Page = ({ className, children }) => {
  
// }

export default Page;

// class Page extends React.Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//       headerHeight: 0
//     };

//     document.title = props.title;

//     this.updateTopOffset = this.updateTopOffset.bind(this);
//     this.renderToolbar = this.renderToolbar.bind(this);
//   }

//   componentDidMount() {
//     this.updateTopOffset();
//     window.addEventListener('resize', this.updateTopOffset, false);
//   }

//   componentWillUnmount() {
//     window.removeEventListener('resize', this.updateTopOffset);
//   }

//   updateTopOffset() {
//     const headerHeight = getHeaderHeight();
//     this.setState({ headerHeight });
//   }

//   renderToolbar() {
//     if (this.props.toolbar !== undefined) {
//       return this.props.toolbar;
//     }
//   }

//   render() {
//     const style = {
//       paddingTop: this.state.headerHeight
//     };

//     return (
//       <div>
//         <div id="header-wrapper">
//           <Header
//             title={this.props.heading}
//             intro={this.props.intro}
//           />
//           {this.props.toolbar}
//         </div>
//         <div 
//           id="main-wrapper"
//           style={style}
//         >
//           <main id="main">
//             {this.props.children}
//           </main>
//         </div>
//       </div>
//     );
//   }
// }