import React, { useState } from "react";
import "./NavBar.css";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Stack,
  InputGroup,
  InputLeftElement,
  Wrap,
  WrapItem,
  Avatar,
  Tooltip,
  Box,
  Tag,
} from "@chakra-ui/react";
import { ChevronDownIcon, Search2Icon } from "@chakra-ui/icons";
import { Input } from "@chakra-ui/react";
import {
  BellIcon,
  QuestionOutlineIcon,
  MoonIcon,
  SunIcon,
} from "@chakra-ui/icons";
// import {HamburgerIcon, AddIcon, ExternalLinkIcon, RepeatIcon, EditIcon, IconButton } from "@chakra-ui/icons"
import logo1 from "../../../images/logo1.gif";
import logo2 from "../../../images/logoG.gif";
const NavBar = () => {
  const [theme, setTheme] = useState("light");
  const [logo, setLogo] = useState(logo1);

  const handleTheme = () => {
    if (theme == "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };
  const handleMouseEnter = () => {
    setLogo(logo2);
  };
  const handleMouseLeave = () => {
    setLogo(logo1);
  };
  const CustomCard = React.forwardRef(({ children, ...rest }, ref) => (
    <Box p="1">
      <Tag ref={ref} {...rest}>
        {children}
      </Tag>
    </Box>
  ));
  const handledeleteAllCards = () => {};
  return (
    <div className="Navbar">
      <div className="Right-Nav">
        <div className="Logo">
          <img
            width="80px"
            src={logo}
            alt="Dan Abramov"
            onMouseOver={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          />
        </div>
        <div className="Right-Menu-Bar">
          <div className="menu">
            <Menu>
              <MenuButton
                className="menu-button"
                as={Button}
                rightIcon={<ChevronDownIcon />}
              >
                WorkSpace
              </MenuButton>
              <MenuList>
                <MenuItem>Download</MenuItem>
                <MenuItem>Create a Copy</MenuItem>
                <MenuItem>Mark as Draft</MenuItem>
                <MenuItem>Delete</MenuItem>
                <MenuItem>Attend a Workshop</MenuItem>
              </MenuList>
            </Menu>
            <Menu>
              <MenuButton
                className="menu-button"
                as={Button}
                rightIcon={<ChevronDownIcon />}
              >
                Recent
              </MenuButton>
              <MenuList>
                <MenuItem>Download</MenuItem>
                <MenuItem>Create a Copy</MenuItem>
                <MenuItem>Mark as Draft</MenuItem>
                <MenuItem>Delete</MenuItem>
                <MenuItem>Attend a Workshop</MenuItem>
              </MenuList>
            </Menu>
            <Menu>
              <MenuButton
                className="menu-button"
                as={Button}
                rightIcon={<ChevronDownIcon />}
              >
                Starred
              </MenuButton>
              <MenuList>
                <MenuItem>Download</MenuItem>
                <MenuItem>Create a Copy</MenuItem>
                <MenuItem>Mark as Draft</MenuItem>
                <MenuItem>Delete</MenuItem>
                <MenuItem>Attend a Workshop</MenuItem>
              </MenuList>
            </Menu>
            <Menu>
              <MenuButton
                className="menu-button"
                as={Button}
                rightIcon={<ChevronDownIcon />}
              >
                Templates
              </MenuButton>
              <MenuList>
                <MenuItem>Download</MenuItem>
                <MenuItem>Create a Copy</MenuItem>
                <MenuItem>Mark as Draft</MenuItem>
                <MenuItem>Delete</MenuItem>
                <MenuItem>Attend a Workshop</MenuItem>
              </MenuList>
            </Menu>
          </div>
          <div id="menu-button">
            <Menu id="menu-button">
              <MenuButton id="menu-button" as={Button}>
                Create
              </MenuButton>
              <MenuList>
                <MenuItem>Download</MenuItem>
                <MenuItem>Create a Copy</MenuItem>
                <MenuItem>Mark as Draft</MenuItem>
                <MenuItem>Delete</MenuItem>
                <MenuItem>Attend a Workshop</MenuItem>
              </MenuList>
            </Menu>
          </div>

          <div id="menu-button" style={{ marginLeft: "1rem" }}>
            <Menu id="menu-button">
              <MenuButton
                id="menu-button"
                as={Button}
                onClick={handledeleteAllCards}
              >
                Clear
              </MenuButton>
            </Menu>
          </div>
        </div>
      </div>
      <div className="Left-Nav">
        <Stack>
          <InputGroup className="search-input">
            <InputLeftElement pointerEvents="none" className="search-icon">
              <Search2Icon color="black.300" />
            </InputLeftElement>
            <Input type="tel" placeholder="Search" size="xs" />
          </InputGroup>
        </Stack>
        <Tooltip label="Notifications">
          <BellIcon bg="none" />
        </Tooltip>
        <Tooltip label="Information">
          <QuestionOutlineIcon />
        </Tooltip>
        <Tooltip label="Theme">
          {theme === "light" ? (
            <MoonIcon onClick={handleTheme} />
          ) : (
            <SunIcon onClick={handleTheme} />
          )}
        </Tooltip>
        <Tooltip label="Account">
          <Wrap>
            <WrapItem>
              <Avatar
                bg="teal"
                size="sm"
                name="Harshit Sachan"
                src="https://bit.ly/tioluwani-kolawole"
              />
            </WrapItem>
          </Wrap>
        </Tooltip>
      </div>
    </div>
  );
};

export default NavBar;
