

const ChangePassword = () => {
    return (
        <div>
            <section className="login-section">
                <div className="login-wrapper">
                    <div className="form-login">
                        <h4 className="login-title">
                            Thay đổi mật khẩu
                        </h4>
                        <form action="#" method="POST" id="login-form">
                            <div className="login-name">
                                <label htmlFor="password">Mật khẩu cũ *</label> <br />
                                <input type="password" id="password" placeholder="Mật khẩu cũ" required />
                            </div>
                            <div className="login-name">
                                <label htmlFor="password">Mật khẩu mới *</label> <br />
                                <input type="password" id="password" placeholder="Mật khẩu mới" required />
                            </div>
                            <div className="login-name">
                                <label htmlFor="password">Nhập lại mật khẩu *</label> <br />
                                <input type="password" id="password" placeholder="Nhập lại mật khẩu" required />
                            </div>

                            <div className="btn-submit">
                                <button type="submit" id="submite-btn">LƯU</button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>

        </div>
    )
}

export default ChangePassword