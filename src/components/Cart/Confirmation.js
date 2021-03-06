import React from 'react'
import styled from 'styled-components'
import { useStaticQuery, graphql } from 'gatsby'
import BlockContent from '@sanity/block-content-to-react'

import MyContext from '../MyContext'
import ConfirmationProduct from './ConfirmationProduct'
import StyledHr from '../shared/StyledHr'
import MobileHr from '../shared/MobileHr'
import CheckoutDivider from '../shared/CheckoutDivider'
import DividerTitle from '../shared/DividerTitle'
import serializers from '../../serializers'

const Wrapper = styled('div')`
    padding: 30px 0 30px 0;
`

const InformationTitle = styled('p')`
    color: grey;
    text-decoration: underline;
    padding-bottom: 10px;
    line-height: 2;
`

const InformationBody = styled('p')`
    padding-bottom: 10px;
    line-height: 2;
`

const PriceWrapper = styled('div')`
    display: flex;
    justify-content: flex-end;
`

const TotalHr = styled(StyledHr)`
    width: 33%;
    margin-right: 0;
`

const OrderInformationGrid = styled('div')`
    display: grid;
    grid-template-columns: max-content 1fr;
    grid-gap: 20px;
    grid-auto-flow: column;
    padding-top: 15px;
`

const OrderInformationLeft = styled('div')`
    grid-column: 1;
`

const OrderInformationRight = styled('div')`
    grid-column: 2;
`

const ThankYou = styled(DividerTitle)`
    font-weight: 500;
`

const PaddingTop = styled('div')`
    padding-top: 15px;
`

function Confirmation ({
    orderId,
    last4,
    kanjiName,
    postcode,
    addressLine1,
    addressLine2,
    phone,
    totalCost
}) {
    const { setItemsInBasket } = React.useContext(MyContext)

    window.onbeforeunload = () => setItemsInBasket([])

    const data = useStaticQuery(graphql`
        query ConfirmationPageQuery {
            sanityConfirmationPage {
            _rawThankYouMessage
            }
        }
    `)

    return (
        <MyContext.Consumer>
        {context => (
            <Wrapper>
            <BlockContent blocks={data.sanityConfirmationPage._rawThankYouMessage} serializers={serializers} />
            <CheckoutDivider
                title='Order Information'
                JPTitle='ご注文内容'
            />
            <OrderInformationGrid>
                <OrderInformationLeft>
                    <InformationTitle>注文番号</InformationTitle>
                </OrderInformationLeft>
                <OrderInformationLeft>
                    <InformationTitle>注文日</InformationTitle>
                </OrderInformationLeft>
                <OrderInformationLeft>
                    <InformationTitle>決済方法</InformationTitle>
                </OrderInformationLeft>
                <OrderInformationLeft>
                    <InformationTitle>配達先</InformationTitle>
                </OrderInformationLeft>
                <OrderInformationRight>
                    <InformationBody>{orderId}</InformationBody>
                </OrderInformationRight>
                <OrderInformationRight>
                    <InformationBody>{new Intl.DateTimeFormat('ja-JP',{ year: 'numeric', month: 'long', day: 'numeric' }).format(Date.now())}</InformationBody>
                </OrderInformationRight>
                <OrderInformationRight>
                    <InformationBody>クレジットカード　**** **** **** {last4}</InformationBody>
                </OrderInformationRight>
                <OrderInformationRight>
                    <InformationBody>
                        <div>{kanjiName}</div>
                        <div>{postcode}</div>
                        <div>{addressLine1}</div>
                        {addressLine2 && <div>{addressLine2}</div>}
                        {phone && <div>{phone}</div>}
                    </InformationBody>
                </OrderInformationRight>
            </OrderInformationGrid>
            <CheckoutDivider
                title='Item Information'
                JPTitle='商品内容'
            />
            <PaddingTop>
                {context.itemsInBasket.map(item =>
                    (
                        <ConfirmationProduct
                            key={item.title}
                            title={item.title}
                            slug={item.slug}
                            price={item.price}
                            flower={item.flower}
                            type={item.type}
                            size={item.size}
                            quantity={item.quantity}
                            image={item.image}
                        />)
                )}
                <PriceWrapper>
                    <p>小計　　{Number(totalCost).toLocaleString('jp')}</p>
                </PriceWrapper>
                <PriceWrapper>
                    <p>送料　　1,000</p>
                </PriceWrapper>
                <TotalHr />
                <MobileHr />
                <PriceWrapper>
                    <p>合計　消費税込　{Number(totalCost + 1000).toLocaleString('jp')}</p>
                </PriceWrapper>
            </PaddingTop>
            </Wrapper>
        )}
        </MyContext.Consumer>
    )
}

export default Confirmation
