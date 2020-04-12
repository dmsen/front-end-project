<template>
  <div class="user-avator-dropdown">
    <Dropdown @on-click="handleClick">
      <Avatar :src="userAvator"/>
      <Icon :size="18" type="md-arrow-dropdown"></Icon>
      <DropdownMenu slot="list">
         <Dropdown placement="right-start">
          <DropdownItem name="changeTheme">更换主题</DropdownItem>
          <DropdownMenu slot="list">
            <DropdownItem @click.native="handleChangeTheme('dark')">
                <Icon type="md-snow" style="color: #666;margin-right: 10px" :size="18"/>dark
            </DropdownItem>
            <DropdownItem @click.native="handleChangeTheme('blue')">
                <Icon type="md-snow" style="color: #001529;margin-right: 10px" :size="18"/>blue
            </DropdownItem>
            <DropdownItem @click.native="handleChangeTheme('light')">
                <Icon type="md-snow" style="color: #19be6b;margin-right: 10px" :size="18"/>light
            </DropdownItem>
            <DropdownItem @click.native="handleChangeTheme('pink')">
                <Icon type="md-snow" style="color: #ffa3d5;margin-right: 10px" :size="18"/>pink
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <DropdownItem name="errRecord">异常报警</DropdownItem>

        <DropdownItem name="logout">退出登录</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>

<script>
import "./user.less";
import { mapActions } from "vuex";
export default {
  name: "User",
  props: {
    userAvator: {
      type: String,
      default: ""
    }
  },
  methods: {
    ...mapActions(["handleLogOut"]),
    handleClick(name) {
      switch (name) {
        case "logout":
          this.handleLogOut().then(() => {
            this.$router.push({
              name: "login"
            });
          });
          break;
        case "errRecord":
          this.$router.push("/alarm/record");
          break;
        case "changeTheme":
          break;
      }
    },
    handleChangeTheme(theme) {
        localStorage.themeStyle = theme;
        window.location.reload()
        // this.$router.replace({
        //     name: this.$config.homeName
        // });
      // this.$store.commit("handleChangeTheme", theme);
    }
  }
};
</script>
