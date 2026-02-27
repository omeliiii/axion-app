"use client"

import {ReactIcon} from "@/components/misc/react-icon";
import {
    DonationItem,
    DonationsByLeagueRequest,
    GetDonationsResponse,
    useGetDonationsByLeagueQuery
} from "@/redux/slices/donations-slice";
import {useEffect, useState} from "react";
import clsx from "clsx";
import {useTranslation} from "@/app/i18n/client";
import {Decimal} from "@/components/numbers/decimal";

interface TopDonationsCardMandatoryProps {
    leagueId: string
    lng: string
}

interface TopDonationsCardOptionalProps {

}

export type TopDonationsCardProps = TopDonationsCardMandatoryProps & Partial<TopDonationsCardOptionalProps>

export const TopDonationsCard = ({leagueId, lng}: TopDonationsCardProps) => {
    const {data: donationsByLeagueResponse = {} as GetDonationsResponse, isSuccess}
        = useGetDonationsByLeagueQuery({leagueId, pagination: {pageIndex: 0, pageSize: 5}} as DonationsByLeagueRequest) as {
        data: GetDonationsResponse;
        isSuccess: boolean;
    }

    const [fullDonations, setFullDonations] = useState([] as DonationItem[])
    const [lockDonations, setLockDonations] = useState([] as DonationItem[])

    useEffect(() => {
        if (donationsByLeagueResponse?.donations && isSuccess) {
            setFullDonations(donationsByLeagueResponse.donations.filter(donation => donation.type == 'donation'))
            setLockDonations(donationsByLeagueResponse.donations.filter(donation => donation.type == 'angel'))
        }
    }, [donationsByLeagueResponse, isSuccess]);

    useEffect(() => {
        const toggleView = () => {
            const parentElement = document.getElementById('scrollable-donations')

            if (parentElement) {
                const scrollWidth = parentElement.scrollWidth
                const scrollLeft = parentElement.scrollLeft

                parentElement.scrollTo({
                    left: scrollLeft == 0 ? scrollWidth : 0,
                    behavior: "smooth",
                })
            }
        }

        const timer = setInterval(toggleView, 10000)

        return () => clearInterval(timer);
    }, []);

    return (
        <div className={'h-full w-full rounded-lg bg-baseline-tertiary bg-opacity-40 px-4 py-2 lg:py-4 relative overflow-hidden'}>
            <ReactIcon iconPath={'/icons/essentials/donate-hand.svg'} className={'absolute top-1/2 left-0 -translate-y-1/2 h-full w-auto opacity-15 z-0'}/>
            <ReactIcon iconPath={'/icons/essentials/donate-dollar.svg'} className={'absolute top-0 right-0 translate-x-1/4 -translate-y-1/4 h-[70%] w-auto opacity-15 z-0'}/>

            <div id={'scrollable-donations'} className={'h-full w-full flex flex-row overflow-x-scroll snap-x snap-mandatory scrollbar-hide'}>
                {fullDonations.length > 0 && (<DonationsInfo lng={lng} donations={fullDonations} type={'donation'} showLoader={fullDonations.length > 0 && lockDonations.length > 0} />)}
                {lockDonations.length > 0 && (<DonationsInfo lng={lng} donations={lockDonations} type={'angel'} showLoader={fullDonations.length > 0 && lockDonations.length > 0} />)}
            </div>
        </div>
    )
}

const DonationsInfo = ({donations, showLoader, lng, type}: {donations: DonationItem[], showLoader: boolean, lng: string, type: 'donation'|'angel'}) => {
    const {t} = useTranslation(lng, 'leagues')

    return (
        <div className={'flex flex-shrink-0 w-full snap-center justify-center'}>
            <div className={'h-full w-full grid grid-rows-[repeat(5,max-content)] lg:grid-rows-[repeat(3,max-content)] grid-cols-1 lg:grid-cols-3 lg:grid-flow-row gap-y-8 lg:gap-y-0'}>
                <div className={'lg:col-span-3 flex flex-col'}>
                    {showLoader && (<Loader />)}
                    <span className={'text-baseline-neutral-white text-2xl font-manrope'}>{t(type == 'donation' ? 'full_donations_title' : 'lock_values_title' as any)}</span>
                </div>
                <span className={'text-baseline-neutral-white text-xs font-manrope lg:col-span-3 pb-8'}>{t(type == 'donation' ? 'full_donations_description' : 'lock_values_description' as any)}</span>

                {donations.slice(0, 3).map((donation, i) => (
                    <div key={i} className={'justify-self-center flex flex-col items-center'}>
                        <Decimal round={2} decimals={donation.denom.decimals} symbolLeft symbol={donation.denom.name} amount={BigInt(donation.amount)} className={'text-baseline-neutral-white text-2xl font-manrope font-semibold'} />
                        <span className={'text-baseline-neutral-white text-sm font-manrope'}>{donation.walletAddress.substring(0, 15)}...</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

const Loader = () => {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setIsLoaded((isLoaded) => !isLoaded);
        }, 10000);

        setTimeout(()=>setIsLoaded(true), 1)

        return () => clearInterval(timer);
    }, []);

    const loaderStyle = clsx('h-0.5 bg-baseline-neutral-white transition-all duration-[10000ms] w-full origin-left' as string, {
        'scale-x-100': isLoaded,
        'scale-x-0': !isLoaded
    } as any)

    return (
        <div className="flex flex-col items-center">
            <div className={loaderStyle} />
        </div>
    )
}