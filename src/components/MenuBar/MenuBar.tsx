/* eslint-disable no-var */
import React, { ReactNode } from 'react';
import {
  IconButton,
  Box,
  CloseButton,
  Flex,
  Icon,
  useColorModeValue,
  Drawer,
  DrawerContent,
  useDisclosure,
  BoxProps,
  FlexProps,
} from '@chakra-ui/react';
import { FiMenu } from 'react-icons/fi';
import { MdOutlineDashboard } from 'react-icons/md';
import { FaRegBuilding } from 'react-icons/fa';
import { BsPersonGear } from 'react-icons/bs';
import { LuUserCircle2 } from 'react-icons/lu';
import { IconType } from 'react-icons';
import { ReactText } from 'react';
import { IoDocumentLockOutline } from 'react-icons/io5';
import { API_BASE, API_URL } from '../../API/apiManager';
import { IoSettingsOutline } from 'react-icons/io5';
import { MdLogout } from 'react-icons/md';
import axios from 'axios';
import { useContextLogo } from '../../context/LogoContext';

interface LinkItemProps {
  name: string;
  icon: IconType;
  path?: string;
  RBAC?: 'COMPLIANCE' | 'ETHICAL' | 'ADMIN' | 'ALL';
  onClick?: () => void;
}
const getToken = sessionStorage.getItem('tokeRBAC');

// console.log(getToken);
if (getToken !== null) {
  var token = JSON.parse(atob(getToken.split('.')[1]));
}

const LinkItems: Array<LinkItemProps> = [
  {
    name: 'Dashboard ',
    icon: MdOutlineDashboard,
    path: '/admin/home',
    RBAC: 'ALL',
  },
  {
    name: 'Denúncias',
    icon: IoDocumentLockOutline,
    path: '/admin/denuncias',
    RBAC: 'ALL',
  },
  // {
  //   name: 'Usuários',
  //   icon: BsPersonGear,
  //   path: '/admin/usuarios',
  //   RBAC: 'ADMIN',
  // },
  {
    name: 'Empresas',
    icon: FaRegBuilding,
    path: '/admin/empresas',
    RBAC: 'ALL',
  },
  // { name: 'Perfil', icon: LuUserCircle2, path: '/admin/perfil', RBAC: 'ADMIN' },
  {
    name: 'Customizações',
    icon: IoSettingsOutline,
    path: '/admin/customizacoes',
    RBAC: 'ALL',
  },
  {
    name: 'Sair',
    icon: MdLogout,
    RBAC: 'ALL',
    onClick: () => logout(),
  },
];

function logout() {
  // console.log(getToken);
  sessionStorage.clear();
  sessionStorage.removeItem('tokeRBAC');
  window.location.href = '/admin/login';
}

interface MenuBarProps {
  children?: ReactNode;
}

export default function MenuBar({ children }: MenuBarProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
      <SidebarContent
        onClose={() => onClose}
        display={{ base: 'none', md: 'block' }}
      />
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav display={{ base: 'flex', md: 'none' }} onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} p="4" className="flex justify-center">
        {/* Content */}
        {children}
      </Box>
    </Box>
  );
}

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  // const [logo, setLogo] = React.useState('');
  const { link } = useContextLogo();
  // React.useEffect(() => {
  //   const options = {
  //     Base: API_BASE,
  //     Accept: 'application/json',
  //   };
  //   axios
  //     .get(API_URL + '/admin/customizations', { headers: options })
  //     .then((response) => {
  //       // console.log(response.data.body[0]);
  //       setLogo(response.data.body[0].LOGO_LINK);
  //     });
  // }, []);

  const handleLogo = (base: string) => {
    switch (base) {
      case 'estrela': {
        return (
          <Box
            mt="4"
            mb="4"
            mx="auto"
            px="4"
            w="100%"
            maxW="200px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            height="80px"
          >
            <img
              src={link}
              alt="Logo Empresa"
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
              }}
            />
          </Box>
        );
      }
      case 'localhost': {
        return (
          <Box
            mt="4"
            mb="4"
            mx="auto"
            // px="4"
            w="100%"
            maxW="200px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            height="80px"
          >
            <img
              src={link}
              alt="Logo Empresa"
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
              }}
            />
          </Box>
        );
      }
      case 'gianthi': {
        return (
          <Box
            mt="4"
            mb="4"
            mx="auto"
            px="4"
            w="100%"
            maxW="200px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            height="80px"
          >
            <img
              src={link}
              alt="Logo Empresa"
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
              }}
            />
          </Box>
        );
      }
      default: {
        return (
          <Box
            mt="4"
            mb="4"
            mx="auto"
            px="4"
            w="100%"
            maxW="200px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            height="80px"
          >
            <img
              src={link}
              alt="Logo Empresa"
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
              }}
            />
          </Box>
        );
      }
    }
  };

  return (
    <Box
      bg={useColorModeValue('white', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex
        h="20"
        alignItems="center"
        mx="8"
        justifyContent="space-between"
        className={API_BASE === 'estrela' ? 'mb-10' : 'mb-0'}
      >
        {/* {<img src={logo} alt="Logo Empresa" width="150px" />} */}
        {handleLogo(API_BASE)}

        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      {LinkItems.map((link) => {
        // console.log(link);

        if (link.RBAC === 'ALL') {
          return (
            <NavItem
              key={link.name}
              icon={link.icon}
              href={link.path}
              RBAC={link.RBAC === 'ALL'}
              onClick={link.onClick}
            >
              {link.name}
            </NavItem>
          );
        } else if (link.RBAC === 'ADMIN' && token.user_access === 'ADMIN') {
          return (
            <NavItem
              key={link.name}
              icon={link.icon}
              href={link.path}
              RBAC={link.RBAC === 'ADMIN'}
              onClick={link.onClick}
            >
              {link.name}
            </NavItem>
          );
        }
      })}
      {/* {LinkItems.map((link) => (
        <NavItem key={link.name} icon={link.icon} href={link.path}>
          {link.name}
        </NavItem>
      ))} */}
    </Box>
  );
};

interface NavItemProps extends FlexProps {
  icon?: IconType;
  children: ReactText;
  href?: string;
  RBAC?: boolean;
}
const NavItem = ({ href, icon, children, ...rest }: NavItemProps) => {
  return (
    <Box
      as="a"
      href={href}
      style={{ textDecoration: 'none' }}
      _focus={{ boxShadow: 'none' }}
    >
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg:
            API_BASE === 'estrela'
              ? '#F4A231'
              : API_BASE === 'localhost'
              ? '#009CDE'
              : API_BASE === 'sbaraini'
              ? '#009CDE'
              : '#009CDE',
          color: 'white',
        }}
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="18"
            _groupHover={{
              color: 'white',
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Box>
  );
};

interface MobileProps extends FlexProps {
  onOpen: () => void;
}
const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 24 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue('white', 'gray.900')}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
      justifyContent="flex-start"
      {...rest}
    >
      <IconButton
        variant="outline"
        onClick={onOpen}
        aria-label="open menu"
        icon={<FiMenu />}
      />
      {/* <Text fontSize="2xl" ml="8" fontFamily="monospace" fontWeight="bold">
        Logo
      </Text> */}
    </Flex>
  );
};
