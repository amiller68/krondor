export default {};
// import styles from './Header.module.scss';
// import * as React from 'react';
// import { Dialog, Transition } from '@headlessui/react';
// import { NavigationItem } from '@components/item/navigation/NavigationItem';
// import { IHeader } from './Header';
// import { ReactNode } from 'react';
// import { classNames } from '@lib/utilities/misc';
// import { INavigationItem } from '@components/item/navigation/NavigationItem';
//
// export interface IMobile extends IHeader {
//   logo?: ReactNode;
//   menu: INavigationItem[];
// }
//
// const Mobile: React.FC<IMobile> = (props: IMobile) => {
//   const [open, setOpen] = React.useState(false);
//
//   return (
//     <>
//       {/* Header Contents */}
//       <div className={'left'}>
//         <NavigationItem
//           key={'menu'}
//           item={'Menu'}
//           action={() => setOpen(true)}
//         />
//       </div>
//       <div className={'right'}>{props.logo}</div>
//       {/* Mobile Menu */}
//       <Transition.Root show={open} as={React.Fragment} unmount={false}>
//         <Dialog
//           as="div"
//           className="fixed inset-0 z-20 overflow-hidden"
//           onClose={setOpen}
//           unmount={false}
//         >
//           <div className="absolute inset-0 overflow-hidden">
//             <Transition.Child
//               as={React.Fragment}
//               enter="ease-in-out duration-300"
//               enterFrom="opacity-0"
//               enterTo="opacity-100"
//               leave="ease-in-out duration-300"
//               leaveFrom="opacity-100"
//               leaveTo="opacity-0"
//             >
//               <Dialog.Overlay className="absolute inset-0 transition-opacity bg-dark-1000 bg-opacity-80" />
//             </Transition.Child>
//
//             <div
//               className={classNames(
//                 'fixed inset-y-0 left-0 pr-10 max-w-[260px] flex',
//                 styles.sidebar
//               )}
//             >
//               <Transition.Child
//                 as={React.Fragment}
//                 enter="transform transition ease-in-out duration-300"
//                 enterFrom="translate-x-[-100%]"
//                 enterTo="translate-x-0"
//                 leave="transform transition ease-in-out duration-300"
//                 leaveFrom="translate-x-0"
//                 leaveTo="translate-x-[-100%]"
//                 unmount={false}
//               >
//                 <div className="w-screen max-w-sm">
//                   <div className="flex flex-col h-full py-6 overflow-x-hidden overflow-y-scroll shadow-xl bg-dark-800">
//                     <nav className="flex-1 pl-6">
//                       {props.menu.map((item) => {
//                         return (
//                           <div key={item.key} className={styles.item}>
//                             <NavigationItem {...item} />{' '}
//                           </div>
//                         );
//                       })}
//                       <NavigationItem
//                         key={'.'}
//                         item={'...'}
//                         action={() => setOpen(false)}
//                       />
//                     </nav>
//                   </div>
//                 </div>
//               </Transition.Child>
//             </div>
//           </div>
//         </Dialog>
//       </Transition.Root>
//     </>
//   );
// };
//
// export default Mobile;
