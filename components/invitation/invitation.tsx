
import IconSvg from '../Controls/mtluc/icon/icon-svg';
import { fonts } from './font';
import classNames from './invitation.module.scss'
const Invitation = () => {
    return <>
        <div className={classNames.wap}>
            <div className={classNames.container}>
                <div className={classNames.main}>
                    <div className={classNames.box_1}>
                        <div className={classNames.main_box}>
                            <div className={classNames.heading}>
                                Thiệp mời
                            </div>
                            <div className={classNames.title}>
                                Save the date
                            </div>
                            <div className={classNames.date}>
                                21 . 01 . 2024
                            </div>
                        </div>

                    </div>
                    <div className={classNames.box_2}>
                        <div className={classNames.main_box}>
                            <div className={classNames.name1}>Yến Linh</div>
                            <div className={classNames.and}>Và</div>
                            <div className={classNames.name2}>Tiến Lực</div>
                        </div>
                    </div>
                    <div className={classNames.box_3}>
                        <div className={classNames.main_box}>
                            <div className={classNames.lable1}>Trân trọng kính mời</div>
                            <div className={classNames.customer_name}>Bạn cùng người thương</div>
                            <div className={classNames.lable2}>Tới dự bữa cơm thân mật chung vui cùng gia đình chúng tôi</div>
                            <div className={classNames.user_main}>
                                <span className={classNames.name}>Đỗ Yến Linh</span>
                                <span className={classNames.and}> <IconSvg iconKeys='heart-double' /> </span>
                                <span className={classNames.name}>Mai Tiến Lực</span>
                            </div>
                            <div className={classNames.title_at_time}>Được tổ chức vào lúc</div>
                            <div className={classNames.at_time}>~ 16 giờ 00 ~</div>
                            <div className={classNames.date}>
                                <span className={classNames.day_of_week}>thứ bảy</span>
                                <span className={classNames.day}>20</span>
                                <span className={classNames.month_year}>01-2024</span>
                            </div>
                            <div className={classNames.lunar_calendar}>Tức ngày 10 tháng 12 năm Quý Mão</div>
                            <div className={classNames.address}>
                                <div className={classNames.at}>Tại: Nhà văn hóa thôn hương trầm</div>
                                <div className={classNames.detail}>Thụy Lâm - Đông Anh - Hà Nội</div>
                            </div>
                        </div>
                    </div>
                    <div className={classNames.box_4}>
                        <div className={classNames.main_box}>
                            <div className={classNames.title}>Lễ Vu Quy</div>
                            <div className={classNames.at_time}>Được tổ chức vào lúc 07 giờ 00</div>
                            <div className={classNames.day_of_week}>~Chủ Nhật~</div>
                            <div className={classNames.date}>21.01.2024</div>
                            <div className={classNames.lunar_calendar}>Tức ngày 11 tháng 12 năm Quý Mão</div>
                            <div className={classNames.address}>
                                <div className={classNames.at}>Tại: Gia đình nhà gái</div>
                                <div className={classNames.detail}>Thôn Hương Trầm - Thụy Lâm - Đông Anh -Hà Nội</div>
                            </div>
                            <div className={classNames.thanks}>
                                Rất hân hạnh được đón tiếp!
                            </div>
                            <div className={classNames.flex}>
                                <div className={classNames.group}>
                                    <div className={classNames.group_title}>Nhà Gái</div>
                                    <div className={classNames.father}>Đỗ An Lượng</div>
                                    <div className={classNames.mother}>Ngô Thị Nhung</div>
                                    <div className={classNames.child}>Cô dâu: Đỗ Yên Linh</div>
                                </div>
                                <div className={classNames.flex_1}>

                                </div>
                                <div className={classNames.group}>
                                    <div className={classNames.group_title}>Nhà Trai</div>
                                    <div className={classNames.father}>Mai Văn Thịnh</div>
                                    <div className={classNames.mother}>ĐÀo Thị Thu</div>
                                    <div className={classNames.child}>Chủ rể: Mai Tiến Lực</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={classNames.box_5}>
                        <div className={classNames.main_box}>
                            <div className={classNames.title}>Trân trọng kính mời</div>
                            <div className={classNames.customer_name}>Bạn Linh</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
}

export default Invitation;