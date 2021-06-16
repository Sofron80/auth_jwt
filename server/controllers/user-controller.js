class UsewrController {
  async registration(req, res, next) {
    try {
      res.json(["registration", "426"]);
    } catch (e) {}
  }

  async login(req, res, next) {
    try {
      res.json(["login", "426"]);
    } catch (e) {}
  }

  async logout(req, res, next) {
    try {
      res.json(["logout", "426"]);
    } catch (e) {}
  }

  async activate(req, res, next) {
    try {
      res.json(["activate", req.params]);
    } catch (e) {}
  }

  async refresh(req, res, next) {
    try {
      res.json(["refresh", "426"]);
    } catch (e) {}
  }

  async getUsers(req, res, next) {
    try {
      res.json(["123", "426"]);
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = new UsewrController();
