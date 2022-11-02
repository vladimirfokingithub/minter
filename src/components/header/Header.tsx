import { IconButton, useMediaQuery } from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import { HeaderMenu, MobileMenu } from "components/header/headerMenu/HeaderMenu";
import { AppLogo } from "components/appLogo";
import { SearchBar } from "components/header/headerSearchBar";
import { HeaderContent, HeaderOptionalContent, HeaderWrapper } from "./styled";

export const Header = () => {
  const [mobileMenu, setMobileMenu] = useState(false);
  const matches = useMediaQuery("(min-width:900px)");

  return (
    <HeaderWrapper position="static">
      <HeaderContent>
        <HeaderOptionalContent>
          {!matches && (
            <IconButton onClick={() => setMobileMenu(true)}>
              <MenuRoundedIcon style={{ width: 40, height: 40, color: "#50A7EA" }} />
            </IconButton>
          )}
          {matches && <AppLogo />}
          {matches && <HeaderMenu />}
        </HeaderOptionalContent>
        <Box sx={{ width: "100%" }}>
          <SearchBar closeMenu={() => setMobileMenu(false)} />
        </Box>
        <MobileMenu showMenu={mobileMenu && !matches} closeMenu={() => setMobileMenu(false)} />
      </HeaderContent>
    </HeaderWrapper>
  );
};
